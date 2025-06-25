import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../../decorators/swagger.decorator';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { GenderType, ChallengeType } from '@/types/challenge.enum';

export function ApiCreateChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 생성',
      description: '새로운 챌린지를 생성합니다.',
    }),
    ApiBody({
      type: CreateChallengeDto,
    }),
    ApiResponse({
      status: 201,
      description: '챌린지 생성 성공',
      schema: {
        type: 'object',
        properties: {
          challengeId: { type: 'number', example: 1 },
          message: {
            type: 'string',
            example: '챌린지가 성공적으로 생성되었습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 에러',
    }),
  );
}

export function ApiGetAllChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 목록 조회',
      description: '필터 및 페이지네이션 조건에 따라 챌린지 목록을 조회합니다.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 항목 수 (기본값: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'type',
      required: false,
      description: '챌린지 유형',
      enum: ChallengeType,
    }),
    ApiQuery({
      name: 'gender',
      required: false,
      description: '성별 필터',
      enum: GenderType,
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: '챌린지 상태 (before | in_progress | finished)',
      example: '',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                challengeUuid: { type: 'string', example: '01HZQK5J8X...' },
                title: { type: 'string', example: '하루 만보 챌린지' },
                type: { type: 'string', example: 'NORMAL' },
                gender: { type: 'string', example: 'ALL' },
                profile: {
                  type: 'string',
                  example: 'https://example.com/image.jpg',
                },
                startDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-01T00:00:00Z',
                },
                endDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-31T00:00:00Z',
                },
                isStarted: { type: 'boolean', example: false },
                isFinished: { type: 'boolean', example: false },
                currentMember: { type: 'number', example: 12 },
                maxMember: { type: 'number', example: 50 },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 123 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 13 },
              hasNextPage: { type: 'boolean', example: true },
            },
          },
        },
      },
    }),
  );
}

export function ApiGetChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 상세 조회',
      description: '특정 챌린지의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 조회 성공',
      schema: {
        type: 'object',
        properties: {
          challengeUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          title: { type: 'string', example: '30일 헬스 챌린지' },
          type: { type: 'string', example: 'NORMAL' },
          profile: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
          },
          banner: { type: 'string', example: 'https://example.com/banner.jpg' },
          introduce: { type: 'string', example: '매일 인증하는 챌린지입니다!' },
          startDate: { type: 'string', example: '2025-07-01' },
          endDate: { type: 'string', example: '2025-07-31' },
          goal: { type: 'number', example: 5 },
          startAge: { type: 'number', example: 18 },
          endAge: { type: 'number', example: 65 },
          gender: { type: 'string', example: 'ALL' },
          maxMember: { type: 'number', example: 50 },
          coinAmount: { type: 'number', example: 1000 },
          isStarted: { type: 'boolean', example: false },
          isFinished: { type: 'boolean', example: false },
          creatorUuid: { type: 'string', example: '01HX123456789ABCDE' },
          isParticipating: { type: 'boolean', example: true },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('CHALLENGE_001', '챌린지를 찾을 수 없습니다.', 404),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiJoinChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 참여',
      description: '챌린지에 참여합니다. 코인이 차감됩니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 참여 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '챌린지에 참여했습니다.',
          },
          challengeUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          userUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          coinUsed: {
            type: 'number',
            example: 1000,
          },
          remainingCoins: {
            type: 'number',
            example: 4000,
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'CHALLENGE_006',
        '참여 조건을 만족하지 않습니다.',
        400,
      ),
    ),
    ApiResponse(
      createErrorResponse('CHALLENGE_004', '챌린지 정원이 가득 찼습니다.', 400),
    ),
    ApiResponse(
      createErrorResponse('CHALLENGE_005', '이미 참여 중인 챌린지입니다.', 400),
    ),
    ApiResponse(
      createErrorResponse(
        'CHALLENGE_007',
        '챌린지가 이미 시작되었습니다.',
        400,
      ),
    ),
    ApiResponse(createErrorResponse('COIN_001', '코인이 부족합니다.', 400)),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(
      createErrorResponse('CHALLENGE_003', '챌린지를 찾을 수 없습니다.', 404),
    ),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiUpdateChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 수정',
      description:
        '챌린지 생성자만 수정할 수 있습니다. 시작된 챌린지는 일부만 수정 가능합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', example: '수정된 챌린지 제목' },
          profile: {
            type: 'string',
            example: 'https://example.com/new-profile.jpg',
          },
          banner: {
            type: 'string',
            example: 'https://example.com/new-banner.jpg',
          },
          introduce: { type: 'string', example: '수정된 챌린지 소개' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 수정 성공',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 403,
      description: '수정 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없음',
    }),
  );
}

export function ApiDeleteChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 삭제',
      description:
        '챌린지 생성자만 삭제할 수 있습니다. 시작된 챌린지는 삭제할 수 없습니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '챌린지가 삭제되었습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 403,
      description: '삭제 권한 없음 또는 시작된 챌린지',
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없음',
    }),
  );
}

/**
 * 사용자 참여 챌린지 조회 API
 */
export function ApiGetUserChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 참여 챌린지 조회',
      description: '현재 로그인한 사용자가 참여 중인 모든 챌린지를 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '사용자 참여 챌린지 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: '성공 여부',
          },
          data: {
            type: 'array',
            description: '참여 중인 챌린지 목록',
            items: {
              type: 'object',
              properties: {
                challengeId: {
                  type: 'number',
                  example: 1,
                  description: '챌린지 ID',
                },
                challengeUuid: {
                  type: 'string',
                  example: '01HXX1X1X1X1X1X1X1X1X1X1X1',
                  description: '챌린지 UUID',
                },
                title: {
                  type: 'string',
                  example: '30일 운동 챌린지',
                  description: '챌린지 제목',
                },
                status: {
                  type: 'string',
                  enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],
                  example: 'IN_PROGRESS',
                  description: '챌린지 상태',
                },
                currentMembers: {
                  type: 'number',
                  example: 5,
                  description: '현재 참여자 수',
                },
                maxMembers: {
                  type: 'number',
                  example: 10,
                  description: '최대 참여자 수',
                },
                startDate: {
                  type: 'string',
                  format: 'date',
                  example: '2025-01-01',
                  description: '챌린지 시작일',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  example: '2025-01-31',
                  description: '챌린지 종료일',
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

/**
 * 챌린지 탈퇴 API
 */
export function ApiLeaveChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 탈퇴',
      description: '사용자가 참여 중인 챌린지에서 탈퇴합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'challengeId',
      description: '탈퇴할 챌린지 ID',
      type: 'number',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 탈퇴 성공',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: '성공 여부',
          },
          message: {
            type: 'string',
            example: '챌린지에서 성공적으로 탈퇴했습니다.',
            description: '응답 메시지',
          },
          data: {
            type: 'object',
            properties: {
              challengeId: {
                type: 'number',
                example: 1,
                description: '챌린지 ID',
              },
              refundedCoins: {
                type: 'number',
                example: 100,
                description: '환불된 코인 수',
              },
            },
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(
      createErrorResponse('CHALLENGE_007', '참여하지 않은 챌린지입니다.', 404),
    ),
    ApiResponse(
      createErrorResponse(
        'CHALLENGE_008',
        '이미 시작된 챌린지는 탈퇴할 수 없습니다.',
        400,
      ),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}
