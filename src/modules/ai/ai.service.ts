/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

export interface ImageAnalysisResult {
  isRelevant: boolean;
  confidence: number;
  reasoning: string;
  suggestedAction: 'approve' | 'reject' | 'review';
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private bedrockClient: BedrockRuntimeClient;

  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({
      region: process.env.BEDROCK_AWS_REGION || 'ap-northeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * 이미지가 챌린지와 관련이 있는지 AI로 분석
   * @param imageBase64 base64로 인코딩된 이미지
   * @param challengeTitle 챌린지 제목
   * @param challengeDescription 챌린지 설명
   * @param verificationGuide 인증 가이드
   * @returns 분석 결과
   */
  async analyzeImageRelevance(
    imageBase64: string,
    challengeTitle: string,
    challengeDescription?: string,
    verificationGuide?: string,
  ): Promise<ImageAnalysisResult> {
    try {
      const prompt = this.buildAnalysisPrompt(
        challengeTitle,
        challengeDescription,
        verificationGuide,
      );

      // Claude 3.5 Haiku 모델 사용
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt,
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      });

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const analysisText = responseBody.content[0].text;
      this.logger.debug(`AI 분석 응답: ${analysisText}`);

      return this.parseAnalysisResult(analysisText);
    } catch (error) {
      this.logger.error('이미지 분석 중 오류 발생:', error);
      // 분석 실패 시 안전하게 리뷰 상태로 처리
      return {
        isRelevant: false,
        confidence: 0,
        reasoning: `이미지 분석 중 오류가 발생했습니다.: ${error.message}`,
        suggestedAction: 'review',
      };
    }
  }

  /**
   * 이미지 분석을 위한 프롬프트 생성
   */
  private buildAnalysisPrompt(
    challengeTitle: string,
    challengeDescription?: string,
    verificationGuide?: string,
  ): string {
    // 인증 가이드를 단계별로 파싱
    const parseVerificationSteps = (guide: string): string[] => {
      if (!guide) return [];
      
      // 숫자. 또는 Step 패턴으로 시작하는 라인들을 찾아서 분리
      const steps = guide.split(/\n/).filter(line => 
        /^\d+\.|^step\s+\d+/i.test(line.trim())
      );
      
      if (steps.length === 0) {
        // 패턴이 없으면 줄바꿈으로 분리
        return guide.split(/\n/).filter(line => line.trim());
      }
      
      return steps;
    };

    const verificationSteps = parseVerificationSteps(verificationGuide);
    const stepsText = verificationSteps.length > 0 
      ? verificationSteps.map((step, idx) => `  ${idx + 1}. ${step.replace(/^\d+\.|^step\s+\d+\.?/i, '').trim()}`).join('\n')
      : verificationGuide || '가이드 없음';

    return `
당신은 챌린지 인증 이미지를 매우 엄격하게 분석하는 AI 전문가입니다. 
사용자가 업로드한 이미지가 챌린지의 인증 가이드를 정확히 따르고 있는지 단계별로 검증해주세요.

**챌린지 정보:**
- 제목: ${challengeTitle}
- 설명: ${challengeDescription || '설명 없음'}

**인증 가이드 (반드시 모든 단계를 확인):**
${stepsText}

**검증 절차:**
1단계: 인증 가이드의 각 단계를 하나씩 체크
  - 각 단계에서 요구하는 구체적인 요소가 이미지에 있는지 확인
  - 예: "만보 인증샷"이라면 → 만보기 화면이나 운동 앱의 10,000보 표시가 명확히 보여야 함
  - 예: "운동 인증"이라면 → 실제 운동하는 모습이나 운동 완료 증빙이 있어야 함

2단계: 이미지의 관련성 판단
  - 인증 가이드의 모든 요구사항을 충족하는가?
  - 단순히 연관된 이미지가 아니라 가이드에서 요구하는 정확한 내용인가?
  - 실제 활동을 증명하는 이미지인가? (조작되거나 무관한 이미지는 아닌가?)

3단계: 신뢰도 점수 산정
  - 90-100: 모든 인증 가이드 요구사항을 명확히 충족
  - 70-89: 대부분의 요구사항 충족, 일부 불명확
  - 50-69: 일부 요구사항만 충족
  - 30-49: 관련성은 있으나 요구사항 미충족
  - 0-29: 전혀 관련 없거나 가짜로 의심

**중요 판단 원칙:**
- 인증 가이드가 구체적일수록 엄격하게 판단
- "만보 인증"이면 반드시 10,000보가 표시된 화면이 있어야 함
- "운동 인증"이면 단순 헬스장 사진이 아닌 실제 운동 증빙이 필요
- 제목과 유사해 보여도 가이드 요구사항을 충족하지 않으면 reject

**응답 형식 (JSON):**
{
  "isRelevant": true/false,
  "confidence": 0-100 (숫자),
  "reasoning": "각 인증 가이드 단계별로 충족 여부를 구체적으로 설명",
  "suggestedAction": "approve/reject/review"
}

**판단 기준:**
- approve: confidence >= 70 & 모든 필수 요구사항 충족
- reject: confidence < 50 또는 핵심 요구사항 미충족
- review: confidence 50-69 또는 판단이 애매한 경우

이미지를 분석하고 reasoning 필드는 반드시 한글로 작성하여 JSON 형식으로만 응답해주세요.
    `;
  }

  /**
   * AI 분석 결과 파싱
   */
  private parseAnalysisResult(analysisText: string): ImageAnalysisResult {
    try {
      // JSON 부분만 추출
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON 형식을 찾을 수 없습니다.');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        isRelevant: Boolean(result.isRelevant),
        confidence: Math.max(0, Math.min(100, Number(result.confidence) || 0)),
        reasoning: String(result.reasoning || '분석 결과 없음'),
        suggestedAction: ['approve', 'reject', 'review'].includes(
          result.suggestedAction,
        )
          ? result.suggestedAction
          : 'review',
      };
    } catch (error) {
      this.logger.error('AI 분석 결과 파싱 오류:', error);
      return {
        isRelevant: false,
        confidence: 0,
        reasoning: '분석 결과를 파싱할 수 없습니다.',
        suggestedAction: 'review',
      };
    }
  }

  /**
   * 여러 이미지를 한번에 분석
   */
  async analyzeMultipleImages(
    imageBase64Array: string[],
    challengeTitle: string,
    challengeDescription?: string,
    verificationGuide?: string,
  ): Promise<ImageAnalysisResult[]> {
    const promises = imageBase64Array.map((imageBase64) =>
      this.analyzeImageRelevance(
        imageBase64,
        challengeTitle,
        challengeDescription,
        verificationGuide,
      ),
    );

    return Promise.all(promises);
  }

  /**
   * 전체 분석 결과를 종합하여 최종 판단
   */
  getFinalVerificationResult(results: ImageAnalysisResult[]): {
    overallResult: 'approved' | 'rejected' | 'pending_review';
    averageConfidence: number;
    details: ImageAnalysisResult[];
  } {
    if (results.length === 0) {
      return {
        overallResult: 'pending_review',
        averageConfidence: 0,
        details: [],
      };
    }

    const approvedCount = results.filter(
      (r) => r.suggestedAction === 'approve',
    ).length;
    const rejectedCount = results.filter(
      (r) => r.suggestedAction === 'reject',
    ).length;
    const reviewCount = results.filter(
      (r) => r.suggestedAction === 'review',
    ).length;

    const averageConfidence =
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

    // 모든 이미지가 승인되면 전체 승인
    if (approvedCount === results.length && averageConfidence >= 70) {
      return {
        overallResult: 'approved',
        averageConfidence,
        details: results,
      };
    }

    // 하나라도 명확히 거절되면 전체 거절
    if (rejectedCount > 0 && averageConfidence < 30) {
      return {
        overallResult: 'rejected',
        averageConfidence,
        details: results,
      };
    }

    // 그 외의 경우는 검토 필요
    return {
      overallResult: 'pending_review',
      averageConfidence,
      details: results,
    };
  }
}
