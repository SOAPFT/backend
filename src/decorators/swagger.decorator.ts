import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * 공통 Swagger 데코레이터 유틸리티
 */

/**
 * 공통 에러 응답 스키마 (ErrorCode 시스템 기반)
 */
export const CommonErrorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
      description: '요청 성공 여부',
    },
    errorCode: {
      type: 'string',
      description: '에러 코드',
      example: 'SYS_001',
    },
    message: {
      type: 'string',
      description: '에러 메시지',
      example: '잘못된 요청입니다.',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: '에러 발생 시각',
      example: '2025-06-22T12:00:00.000Z',
    },
    path: {
      type: 'string',
      description: '요청 경로',
      example: '/api/users/profile',
    },
    method: {
      type: 'string',
      description: 'HTTP 메서드',
      example: 'POST',
    },
    details: {
      type: 'object',
      description: '에러 상세 정보 (선택적)',
      additionalProperties: true,
      example: {},
    },
  },
  required: ['success', 'errorCode', 'message', 'timestamp', 'path', 'method'],
};

/**
 * 에러코드별 응답 생성 헬퍼
 */
export function createErrorResponse(
  errorCode: string,
  message: string,
  statusCode: number,
  example?: any,
  method?: string,
) {
  return {
    status: statusCode,
    description: message,
    schema: {
      ...CommonErrorSchema,
      properties: {
        ...CommonErrorSchema.properties,
        errorCode: {
          ...CommonErrorSchema.properties.errorCode,
          example: errorCode,
        },
        message: {
          ...CommonErrorSchema.properties.message,
          example: message,
        },
        method: method
          ? {
              ...CommonErrorSchema.properties.method,
              example: method,
            }
          : CommonErrorSchema.properties.method,
        details: example
          ? {
              ...CommonErrorSchema.properties.details,
              example,
            }
          : CommonErrorSchema.properties.details,
      },
    },
  };
}

/**
 * 공통 인증 오류 응답
 */
export const CommonAuthResponses = {
  Unauthorized: createErrorResponse(
    'AUTH_001',
    '유효하지 않은 토큰입니다.',
    401,
  ),
  Forbidden: createErrorResponse('AUTH_002', '권한이 없습니다.', 403),
  TokenExpired: createErrorResponse('AUTH_003', '토큰이 만료되었습니다.', 401),
};

/**
 * 공통 에러 응답
 */
export const CommonErrorResponses = {
  BadRequest: createErrorResponse('SYS_001', '잘못된 요청입니다.', 400),
  ValidationFailed: createErrorResponse(
    'SYS_002',
    '입력값 검증에 실패했습니다.',
    400,
  ),
  NotFound: createErrorResponse(
    'SYS_003',
    '요청한 리소스를 찾을 수 없습니다.',
    404,
  ),
  InternalServerError: createErrorResponse(
    'SYS_005',
    '서버 내부 오류가 발생했습니다.',
    500,
  ),
  DatabaseError: createErrorResponse(
    'SYS_006',
    '데이터베이스 오류가 발생했습니다.',
    500,
  ),
  ExternalApiError: createErrorResponse(
    'SYS_007',
    '외부 API 호출에 실패했습니다.',
    502,
  ),
};

/**
 * HTTP 메서드별 에러 응답 생성 헬퍼들
 */
export const ErrorResponses = {
  GET: (
    errorCode: string,
    message: string,
    statusCode: number,
    example?: any,
  ) => createErrorResponse(errorCode, message, statusCode, example, 'GET'),

  POST: (
    errorCode: string,
    message: string,
    statusCode: number,
    example?: any,
  ) => createErrorResponse(errorCode, message, statusCode, example, 'POST'),

  PUT: (
    errorCode: string,
    message: string,
    statusCode: number,
    example?: any,
  ) => createErrorResponse(errorCode, message, statusCode, example, 'PUT'),

  PATCH: (
    errorCode: string,
    message: string,
    statusCode: number,
    example?: any,
  ) => createErrorResponse(errorCode, message, statusCode, example, 'PATCH'),

  DELETE: (
    errorCode: string,
    message: string,
    statusCode: number,
    example?: any,
  ) => createErrorResponse(errorCode, message, statusCode, example, 'DELETE'),
};

/**
 * 공통 페이지네이션 스키마
 */
export const PaginationSchema = {
  type: 'object',
  properties: {
    currentPage: {
      type: 'number',
      description: '현재 페이지',
      example: 1,
    },
    totalPages: {
      type: 'number',
      description: '전체 페이지 수',
      example: 10,
    },
    totalItems: {
      type: 'number',
      description: '전체 항목 수',
      example: 100,
    },
    itemsPerPage: {
      type: 'number',
      description: '페이지당 항목 수',
      example: 10,
    },
    hasNext: {
      type: 'boolean',
      description: '다음 페이지 존재 여부',
      example: true,
    },
    hasPrev: {
      type: 'boolean',
      description: '이전 페이지 존재 여부',
      example: false,
    },
  },
};

/**
 * 헬스체크용 데코레이터
 */
export function ApiHealthCheck() {
  return applyDecorators(
    ApiOperation({
      summary: '헬스 체크',
      description: '서버 상태를 확인합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '서버 정상 동작',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
          uptime: {
            type: 'number',
            description: '서버 가동 시간 (초)',
            example: 3600,
          },
        },
      },
    }),
  );
}
