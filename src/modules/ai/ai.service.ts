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
    return `
당신은 챌린지 인증 이미지를 분석하는 AI 전문가입니다. 사용자가 업로드한 이미지가 다음 챌린지와 관련이 있는지 판단해주세요.

**챌린지 정보:**
- 제목: ${challengeTitle}
- 설명: ${challengeDescription || '설명 없음'}
- 인증 가이드: ${verificationGuide || '가이드 없음'}

**분석 기준:**
1. 이미지가 인증 가이드에 명시된 요구사항을 충족하는가? (가장 중요)
2. 인증 가이드에 명시된 특정 요소들이 이미지에 포함되어 있는가?
3. 이미지가 실제 활동을 보여주는가? (스크린샷, 가짜 이미지 등은 의심)
4. 챌린지 제목과의 연관성도 고려하되, 인증 가이드를 우선으로 판단하세요.

**중요 사항:**
- 인증 가이드가 있다면 제목보다 인증 가이드의 요구사항을 더 중요하게 고려하세요.
- 인증 가이드가 명확하지 않은 경우에만 제목과 설명을 참고하세요.

**응답 형식 (JSON):**
{
  "isRelevant": true/false,
  "confidence": 0-100 (숫자),
  "reasoning": "구체적인 판단 근거를 한글로 작성",
  "suggestedAction": "approve/reject/review"
}

**예시:**
- 런닝 챌린지 (인증 가이드: GPS 앱 화면 포함): GPS 운동 기록 화면 + 운동복 → approve
- 런닝 챌린지 (인증 가이드: 운동화 착용 모습): 운동화를 신고 있는 발 사진 → approve
- 런닝 챌린지: 음식 사진, 실내 풍경, 관련 없는 셀피 → reject
- 애매한 경우 (인증 가이드와 부분적으로만 일치) → review

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
