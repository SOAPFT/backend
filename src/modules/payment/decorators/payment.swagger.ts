import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

export function ApiPostWithdraw() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '코인 차감(기프티콘 변환)',
      description:
        '출금 계좌 입력 없이, 차감할 코인 수량(amount)만 전달합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            example: 5000,
            description: '차감할 코인 수량',
          },
        },
        required: ['amount'],
      },
    }),
    ApiResponse({
      status: 201,
      description: '코인 차감 성공',
      schema: {
        example: {
          message: '기프티콘 변환이 완료되었습니다.',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '코인 부족 또는 유효하지 않은 요청',
      schema: {
        example: {
          statusCode: 400,
          message: '보유 코인이 부족합니다.',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'JWT 인증 실패',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
  );
}
