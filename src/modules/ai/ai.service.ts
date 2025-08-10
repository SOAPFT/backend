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
  suggestedAction: 'approve' | 'reject';
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
        suggestedAction: 'reject',
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
      const steps = guide
        .split(/\n/)
        .filter((line) => /^\d+\.|^step\s+\d+/i.test(line.trim()));

      if (steps.length === 0) {
        // 패턴이 없으면 줄바꿈으로 분리
        return guide.split(/\n/).filter((line) => line.trim());
      }

      return steps;
    };

    const verificationSteps = parseVerificationSteps(verificationGuide);
    const stepsText =
      verificationSteps.length > 0
        ? verificationSteps
            .map(
              (step, idx) =>
                `  ${idx + 1}. ${step.replace(/^\d+\.|^step\s+\d+\.?/i, '').trim()}`,
            )
            .join('\n')
        : verificationGuide || '가이드 없음';

    return `
당신은 챌린지 인증 이미지를 매우 엄격하게 분석하는 AI 전문가입니다. 
사용자가 업로드한 이미지가 챌린지의 인증 가이드를 정확히 따르고 있는지 단계별로 검증해주세요.

**챌린지 정보:**
- 제목: ${challengeTitle}
- 설명: ${challengeDescription || '설명 없음'}

**인증 가이드 (모든 단계를 빠짐없이 확인):**
${stepsText}

**⚠️ 핵심 검증 원칙:**
1. 인증 가이드를 문자 그대로 해석하여 엄격하게 검증
2. "보이도록", "표시", "인증할만한 요소" 등의 키워드가 있으면 해당 내용이 이미지에 반드시 명확히 보여야 함
3. 간접적 증거나 관련 환경만으로는 불충분 - 직접적인 증빙 필요

**검증 프로세스:**

【Step 1】 인증 가이드 요구사항 분석
각 단계별로 반드시 확인해야 할 핵심 요소 추출:
- "걸음수/횟수/시간" 등 수치 언급 → 해당 숫자가 화면에 표시되어야 함
- "측정한다" → 측정 결과가 보여야 함  
- "인증할만한 요소가 보이도록" → 명시된 요소가 명확히 식별 가능해야 함
- "사진을 찍어" → 해당 활동의 직접적 증거 필요

【Step 2】 이미지 검증
인증 가이드의 각 요구사항별로 체크:
□ Step 1 요구사항: [충족/미충족] - 구체적 근거
□ Step 2 요구사항: [충족/미충족] - 구체적 근거  
□ Step 3 요구사항: [충족/미충족] - 구체적 근거

【Step 3】 엄격한 평가 기준 적용

**구체적 검증 예시:**
- "만보 이상의 걸음수를 인증할만한 요소가 보이도록" 
  → ✅ 10,000보 이상 숫자가 앱/기기 화면에 표시
  → ❌ 단순 런닝머신이나 운동 장비 사진
  
- "운동 시간이 표시된 화면"
  → ✅ 운동 시간이 숫자로 명확히 표시된 화면
  → ❌ 시계나 운동 중인 모습만 있는 사진

- "독서 페이지 인증"  
  → ✅ 책과 함께 읽은 페이지 수가 표시된 증빙
  → ❌ 단순 책 표지나 독서 공간 사진

**신뢰도 점수 기준:**
- 80-100점: 모든 인증 가이드 요구사항을 명확하게 충족 → APPROVE
- 60-79점: 핵심 요구사항은 충족하나 일부 불명확 → 엄격 판단하여 APPROVE/REJECT 결정
- 40-59점: 일부 요구사항만 충족, 핵심 증빙 불충분 → REJECT
- 0-39점: 요구사항 대부분 미충족 또는 무관 → REJECT

**APPROVE 조건 (모두 충족해야 함):**
✓ 인증 가이드의 모든 핵심 요구사항 충족
✓ "보이도록", "표시" 등 요구한 요소가 명확히 식별 가능
✓ 실제 활동을 직접적으로 증명하는 내용

**REJECT 조건 (하나라도 해당되면):**
✗ 인증 가이드 핵심 요구사항 중 하나라도 미충족
✗ "보이도록" 요구한 요소가 보이지 않음  
✗ 수치/데이터를 요구했는데 해당 정보 없음
✗ 간접적 증거만 있고 직접적 증빙 없음
✗ 관련 환경이나 도구만 보이고 실제 활동 증빙 없음

**명확한 판단 원칙:**
- 의심스럽거나 불확실하면 → REJECT
- 요구사항을 "거의" 충족하면 → REJECT (거의는 미충족)
- 관련은 있지만 정확하지 않으면 → REJECT

**응답 형식 (JSON):**
{
  "isRelevant": true/false,
  "confidence": 0-100 (숫자),
  "reasoning": "인증 가이드 각 Step별로: [Step 1] 충족/미충족 - 구체적 이유, [Step 2] 충족/미충족 - 구체적 이유, [Step 3] 충족/미충족 - 구체적 이유. 미충족시 정확히 어떤 요소가 부족한지 명시",
  "suggestedAction": "approve/reject"
}

**최종 판단 (review 사용 금지):**
- approve: 모든 핵심 요구사항을 명확히 충족하는 경우만
- reject: 그 외 모든 경우 (애매하면 reject)

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
        suggestedAction: ['approve', 'reject'].includes(result.suggestedAction)
          ? result.suggestedAction
          : 'reject',
      };
    } catch (error) {
      this.logger.error('AI 분석 결과 파싱 오류:', error);
      return {
        isRelevant: false,
        confidence: 0,
        reasoning: '분석 결과를 파싱할 수 없습니다.',
        suggestedAction: 'reject',
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
    overallResult: 'approved' | 'rejected';
    averageConfidence: number;
    details: ImageAnalysisResult[];
  } {
    if (results.length === 0) {
      return {
        overallResult: 'rejected',
        averageConfidence: 0,
        details: [],
      };
    }

    const approvedCount = results.filter(
      (r) => r.suggestedAction === 'approve',
    ).length;

    const averageConfidence =
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

    // 엄격한 기준: 모든 이미지가 승인되어야만 전체 승인
    if (approvedCount === results.length) {
      return {
        overallResult: 'approved',
        averageConfidence,
        details: results,
      };
    }

    // 하나라도 거절되면 전체 거절
    return {
      overallResult: 'rejected',
      averageConfidence,
      details: results,
    };
  }
}
