import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../decorators/swagger.decorator';

export function ApiKakaoLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '카카오 로그인',
      description: '카카오 소셜 로그인을 진행합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              nickname: { type: 'string', example: '사용자' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_004', '소셜 로그인에 실패했습니다.', 401),
    ),
    ApiResponse(
      createErrorResponse('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiNaverLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '네이버 로그인',
      description: '네이버 소셜 로그인을 진행합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              nickname: { type: 'string', example: '사용자' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_004', '소셜 로그인에 실패했습니다.', 401),
    ),
    ApiResponse(
      createErrorResponse('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiAppleLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '애플 로그인',
      description: '애플 소셜 로그인을 진행합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              nickname: { type: 'string', example: '사용자' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_004', '소셜 로그인에 실패했습니다.', 401),
    ),
    ApiResponse(
      createErrorResponse('AUTH_006', '지원하지 않는 소셜 제공자입니다.', 400),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 갱신',
      description: '리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            description: '리프레시 토큰',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '토큰 갱신 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'AUTH_005',
        '유효하지 않은 리프레시 토큰입니다.',
        401,
      ),
    ),
    ApiResponse(CommonAuthResponses.TokenExpired),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({
      summary: '로그아웃',
      description: '사용자 로그아웃을 처리합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '로그아웃되었습니다.',
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiVerifyToken() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 검증',
      description: '액세스 토큰의 유효성을 검증합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '토큰이 유효함',
      schema: {
        type: 'object',
        properties: {
          valid: {
            type: 'boolean',
            example: true,
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              nickname: { type: 'string', example: '사용자' },
            },
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonAuthResponses.TokenExpired),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiDevToken() {
  return applyDecorators(
    ApiOperation({
      summary: '[개발용] 토큰 생성',
      description: '개발 환경에서 테스트용 토큰을 생성합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: {
            type: 'number',
            description: '사용자 ID',
            example: 1,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '토큰 생성 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('USER_001', '사용자를 찾을 수 없습니다.', 404),
    ),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiTestAuth() {
  return applyDecorators(
    ApiOperation({
      summary: '[개발용] 인증 테스트',
      description: '인증이 필요한 엔드포인트 테스트용입니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '인증 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '인증된 사용자입니다.',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              nickname: { type: 'string', example: '사용자' },
            },
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonAuthResponses.TokenExpired),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}
