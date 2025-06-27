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
      description: '사용자가 챌린지에 참여하고 코인을 차감합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      required: true,
      description: '참여할 챌린지의 UUID',
      example: '01HZQK5J8XABCDEF1234567890',
    }),
    ApiResponse({
      description: '챌린지 참여 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '참가 완료' },
          challengeUuid: {
            type: 'string',
            example: '01HZQK5J8XABCDEF1234567890',
          },
        },
      },
    }),
    ApiResponse({
      status: 402,
      description: '코인이 부족하여 참여 불가',
      schema: {
        example: {
          errorCode: 'INSUFFICIENT_COINS',
          message: '챌린지를 생성할 코인이 부족합니다.',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '챌린지가 존재하지 않음',
      schema: {
        example: {
          errorCode: 'CHALLENGE_001',
          message: '해당 아이디의 챌린지가 없습니다.',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: '중복 참가, 조건 미달 등으로 인한 챌린지 참여 실패',
      content: {
        'application/json': {
          examples: {
            AlreadyStarted: {
              summary: '이미 시작된 챌린지',
              value: {
                errorCode: 'CHALLENGE_002',
                message: '이미 시작된 챌린지입니다.',
              },
            },
            AlreadyFinished: {
              summary: '이미 종료된 챌린지',
              value: {
                errorCode: 'CHALLENGE_003',
                message: '이미 종료된 챌린지 입니다.',
              },
            },
            ChallengeFull: {
              summary: '정원이 다 찼을 경우',
              value: {
                errorCode: 'CHALLENGE_004',
                message: '정원이 다 찼습니다.',
              },
            },
            AlreadyJoined: {
              summary: '이미 참가한 경우',
              value: {
                errorCode: 'CHALLENGE_006',
                message: '이미 참가한 챌린지 입니다.',
              },
            },
            AgeNotMet: {
              summary: '연령 조건 불충족',
              value: {
                errorCode: 'CHALLENGE_011',
                message: '참여 가능한 연령 조건을 만족하지 않습니다.',
              },
            },
            GenderNotMet: {
              summary: '성별 조건 불충족',
              value: {
                errorCode: 'CHALLENGE_012',
                message: '성별 조건을 만족하지 않습니다.',
              },
            },
          },
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: '서버 내부 오류',
    }),
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

export function ApiGetRecentChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '최근 생성된 챌린지 조회',
      description: '최근 일주일 내에 생성된 챌린지 중 최대 15개를 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지 조회 성공',
      schema: {
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
 * 성공한 챌린지 수
 */

export function ApiGetUserCompletedChallengeCount() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자가 성공한 챌린지 개수 조회',
      description: '사용자가 완료한(성공한) 챌린지의 총 개수를 반환합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 조회됨',
      schema: {
        example: {
          completedChallengeCount: 3,
        },
      },
    }),
  );
}

/**
 * 챌린지 탈퇴 API
 */
export function ApiLeaveChallenge() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 탈퇴',
      description: '사용자가 특정 챌린지에서 탈퇴합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      type: 'string',
      description: '탈퇴할 챌린지의 UUID',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: '탈퇴 성공',
      schema: {
        example: {
          message: '챌린지에서 성공적으로 탈퇴했습니다.',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '이미 시작된 챌린지는 탈퇴 불가',
      schema: {
        example: {
          statusCode: 403,
          errorCode: 'CHALLENGE_002',
          message: '챌린지가 시작되어 나갈 수 없습니다.',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없음',
      schema: {
        example: {
          statusCode: 404,
          errorCode: 'CHALLENGE_001',
          message: '해당 아이디의 챌린지가 없습니다.',
          error: 'Not Found',
        },
      },
    }),
  );
}
