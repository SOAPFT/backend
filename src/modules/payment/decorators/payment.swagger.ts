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
      summary: '출금 요청',
      description: '계좌번호와 코인 수량을 입력하여 출금 요청을 보냅니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          accountNumber: {
            type: 'string',
            example: '110123456789',
            description: '출금 대상 계좌번호',
          },
          amount: {
            type: 'number',
            example: 5000,
            description: '출금할 코인 수량',
          },
        },
        required: ['accountNumber', 'amount'],
      },
    }),
    ApiResponse({
      status: 201,
      description: '출금 요청 성공',
      schema: {
        example: {
          message: '출금 요청 완료',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '코인 부족 또는 유효하지 않은 요청',
      schema: {
        example: {
          statusCode: 400,
          message: '잔액 부족',
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
