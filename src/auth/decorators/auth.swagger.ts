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
import { SocialLoginDto } from '../dto/auth.dto';

export function ApiKakaoLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '카카오 로그인',
      description:
        '카카오 access token으로 로그인하고, access/refresh 토큰을 반환합니다.',
    }),
    ApiBody({ type: SocialLoginDto }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string', example: 'access_token_string' },
          refresh_token: { type: 'string', example: 'refresh_token_string' },
          isNewUser: { type: 'boolean', example: true },
          message: { type: 'string', example: '로그인 성공' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_001', '유효하지 않은 토큰입니다.', 401),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiNaverLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '네이버 로그인',
      description:
        '네이버 access token으로 로그인하고, access/refresh 토큰을 반환합니다.',
    }),
    ApiBody({ type: SocialLoginDto }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string', example: 'access_token_string' },
          refresh_token: { type: 'string', example: 'refresh_token_string' },
          isNewUser: { type: 'boolean', example: false },
          message: { type: 'string', example: '로그인 성공' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_001', '유효하지 않은 토큰입니다.', 401),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiAppleLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Apple 로그인',
      description:
        'Apple identity token으로 로그인하고, access/refresh 토큰을 반환합니다.',
    }),
    ApiBody({ type: SocialLoginDto }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string', example: 'access_token_string' },
          refresh_token: { type: 'string', example: 'refresh_token_string' },
          isNewUser: { type: 'boolean', example: true },
          message: { type: 'string', example: '로그인 성공' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('AUTH_001', '유효하지 않은 토큰입니다.', 401),
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
        'AUTH_001',
        '유효하지 않은 리프레시 토큰입니다.',
        401,
      ),
    ),
    ApiResponse(CommonAuthResponses.TokenExpired),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiDevToken() {
  return applyDecorators(
    ApiOperation({
      summary: '개발용 토큰 발급',
      description: '바디 없이 호출 시 개발용 accessToken 및 refreshToken 발급',
    }),
    ApiResponse({
      status: 200,
      description: '토큰 발급 성공',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'access_token_value' },
          refreshToken: { type: 'string', example: 'refresh_token_value' },
        },
      },
    }),
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
