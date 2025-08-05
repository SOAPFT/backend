import {
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../../decorators/swagger.decorator';
import { ChallengeResponseDto } from '../dto/challenge-response.dto';
import { MonthlyChallengeStatsResponseDto } from '../dto/monthly-challenge-stats.response.dto';
import { GenderType, ChallengeType } from '@/types/challenge.enum';
import { applyDecorators } from '@nestjs/common';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

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
          challengeUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          message: {
            type: 'string',
            example: '챌린지가 성공적으로 생성되었습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description:
        '잘못된 요청 (입력값 오류, 코인 부족, 날짜 오류, 연령 조건 불일치 등)',
      content: {
        'application/json': {
          examples: {
            InvalidInput: {
              summary: '입력값이 올바르지 않을 때',
              value: {
                errorCode: 'SYS_004',
                message: '입력값이 올바르지 않습니다.',
              },
            },
            CoinInsufficient: {
              summary: '코인이 부족할 때',
              value: {
                errorCode: 'COIN_001',
                message: '챌린지를 생성할 코인이 부족합니다.',
              },
            },
            InvalidDates: {
              summary: '시작일과 종료일이 올바르지 않을 때',
              value: {
                errorCode: 'CHALLENGE_009',
                message: '시작일과 종료일이 올바르지 않습니다.',
              },
            },
            AgeNotMet: {
              summary: '연령 조건에 맞지 않을 때',
              value: {
                errorCode: 'CHALLENGE_011',
                message: '연령 조건에 맞지 않습니다.',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 오류',
      content: {
        'application/json': {
          example: {
            errorCode: 'SYS_001',
            message: '서버 오류가 발생했습니다.',
          },
        },
      },
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
          profile: {
            type: 'string',
            example: 'https://example.com/new-profile.jpg',
          },
          banner: {
            type: 'string',
            example: 'https://example.com/new-banner.jpg',
          },
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
      description:
        '현재 로그인한 사용자가 참여 중인 챌린지 및 미션을 모두 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '사용자 참여 챌린지 조회 성공',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1,
              description: '챌린지 또는 미션의 ID',
            },
            challengeUuid: {
              type: 'string',
              nullable: true,
              example: '01JZFP44NM9XPNFQRQF4CHE9A6',
              description: '챌린지 UUID (미션의 경우 null)',
            },
            title: {
              type: 'string',
              example: '30일 걷기 챌린지',
              description: '제목',
            },
            banner: {
              type: 'string',
              nullable: true,
              example: 'https://cdn.example.com/images/challenge-banner.png',
              description: '배너 이미지 URL (미션의 경우 null)',
            },
            maxMember: {
              type: 'number',
              nullable: true,
              example: 30,
              description: '최대 참여 인원 (미션의 경우 null)',
            },
            currentMember: {
              type: 'number',
              nullable: true,
              example: 15,
              description: '현재 참여 인원 (미션의 경우 null)',
            },
            challengeType: {
              type: 'string',
              enum: ['GROUP', 'EVENT'],
              example: 'GROUP',
              description: '챌린지 유형 (GROUP: 그룹 챌린지, EVENT: 개인 미션)',
            },
          },
        },
        example: [
          {
            id: 1,
            challengeUuid: '01JZFP44NM9XPNFQRQF4CHE9A6',
            title: '30일 걷기 챌린지',
            banner: 'https://cdn.example.com/images/challenge-banner.png',
            maxMember: 30,
            currentMember: 15,
            challengeType: 'GROUP',
          },
          {
            id: 2,
            challengeUuid: null,
            title: '10000보 걷기 미션',
            banner: null,
            maxMember: null,
            currentMember: null,
            challengeType: 'EVENT',
          },
        ],
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

/**
 * 인기 챌린지 조회 API
 */
export function ApiGetPopularChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '인기 챌린지 목록 조회',
      description: '참여자 수가 가장 많은 상위 15개 챌린지를 반환합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '인기 챌린지 조회 성공',
      type: ChallengeResponseDto,
      isArray: true,
    }),
  );
}

/**
 * 챌린지 검색 API
 */
export function ApiSearchChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 검색',
      description: '키워드로 챌린지를 검색하고 페이지네이션 결과를 반환합니다.',
    }),
    ApiQuery({
      name: 'keyword',
      required: false,
      description: '검색 키워드',
      type: String,
      example: '새벽 기상',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호',
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 결과 수',
      type: Number,
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: '검색된 챌린지 목록과 페이지 정보',
      schema: {
        example: {
          data: [
            {
              id: 1,
              challengeUuid: '01JZFP44NM9XPNFQRQF4CHE9A6',
              title: '6월 새벽 기상 챌린지',
              banner: 'https://cdn.example.com/images/challenge-banner.png',
              maxMember: 30,
              currentMember: 15,
              challengeType: 'GROUP',
              isParticipated: true,
            },
            {
              id: 2,
              challengeUuid: null,
              title: '10000보 걷기 미션',
              banner: null,
              maxMember: null,
              currentMember: null,
              challengeType: 'EVENT',
              isParticipated: false,
            },
          ],
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
          },
        },
      },
    }),
  );
}

/**
 * 챌린지 달성률 API
 */
export function ApiGetUserChallengeProgress() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 챌린지 진행률 조회',
      description:
        '특정 챌린지에 대해 사용자의 주차별 진행 정보, 전체 달성률, 참가자 수, 시작일, 종료일을 반환합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      description: '조회할 챌린지 UUID',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: '사용자 챌린지 진행률 조회 성공',
      schema: {
        type: 'object',
        properties: {
          challengeInfo: {
            type: 'object',
            properties: {
              participantCount: { type: 'number', example: 23 },
              startDate: {
                type: 'string',
                example: '2025-07-01T00:00:00.000Z',
              },
              endDate: { type: 'string', example: '2025-07-31T23:59:59.000Z' },
            },
          },
          totalAchievementRate: { type: 'number', example: 67 },
        },
      },
    }),
  );
}

export function ApiGetMonthlyChallengeStats() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 월별 인증 현황 조회',
      description:
        '해당 챌린지의 지정된 월에 대해 날짜별 인증 수 및 인증한 사용자 정보 배열을 반환합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      description: '조회할 챌린지 UUID',
      type: String,
    }),
    ApiQuery({
      name: 'year',
      description: '조회할 연도 (예: 2025)',
      type: Number,
    }),
    ApiQuery({
      name: 'month',
      description: '조회할 달 (1-12)',
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: '월별 인증 현황 조회 성공',
      type: MonthlyChallengeStatsResponseDto,
    }),
  );
}

export function ApiGetChallengeVerificationStats() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 AI 검증 통계 조회',
      description: '특정 챌린지의 AI 검증 상태별 통계를 조회합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      type: String,
      description: '조회할 챌린지 UUID',
      example: '01JZZP4T40RB3H2SP70PKBJWNR',
    }),
    ApiResponse({
      status: 200,
      description: '검증 통계 조회 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '챌린지 검증 통계 조회 성공',
          },
          data: {
            type: 'object',
            properties: {
              challengeUuid: {
                type: 'string',
                example: '01JZZP4T40RB3H2SP70PKBJWNR',
              },
              totalPosts: {
                type: 'number',
                example: 150,
                description: '총 게시글 수',
              },
              pendingCount: {
                type: 'number',
                example: 5,
                description: '검증 대기 중인 게시글 수',
              },
              approvedCount: {
                type: 'number',
                example: 120,
                description: '승인된 게시글 수',
              },
              rejectedCount: {
                type: 'number',
                example: 15,
                description: '거부된 게시글 수',
              },
              reviewCount: {
                type: 'number',
                example: 10,
                description: '검토 필요한 게시글 수',
              },
              averageConfidence: {
                type: 'number',
                example: 0.78,
                description: '평균 AI 신뢰도 점수',
              },
              verificationRate: {
                type: 'number',
                example: 0.93,
                description: '검증 완료율 (대기중 제외)',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없음',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'CHALLENGE_001' },
          message: { type: 'string', example: '챌린지를 찾을 수 없습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 내부 오류',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'SYS_001' },
          message: { type: 'string', example: '서버 오류가 발생했습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}

export function ApiGetChallengePostsForReview() {
  return applyDecorators(
    ApiOperation({
      summary: '챌린지 검토 필요한 게시글 목록 조회',
      description:
        'AI 검증에서 검토가 필요하다고 판단된 게시글들을 조회합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      type: String,
      description: '조회할 챌린지 UUID',
      example: '01JZZP4T40RB3H2SP70PKBJWNR',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: '페이지 번호 (기본값: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: '페이지당 항목 수 (기본값: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: '검토 필요한 게시글 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '검토 필요한 게시글 목록 조회 성공',
          },
          data: {
            type: 'object',
            properties: {
              posts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    postUuid: {
                      type: 'string',
                      example: '01JZZP4T40RB3H2SP70PKBJWNR',
                    },
                    title: {
                      type: 'string',
                      example: '오늘의 러닝 인증',
                    },
                    content: {
                      type: 'string',
                      example: '5km 완주했습니다!',
                    },
                    imageUrl: {
                      type: 'array',
                      items: { type: 'string' },
                      example: [
                        'https://example.com/image1.jpg',
                        'https://example.com/image2.jpg',
                      ],
                    },
                    verificationStatus: {
                      type: 'string',
                      example: 'review',
                      description: '검증 상태',
                    },
                    aiConfidence: {
                      type: 'number',
                      example: 0.45,
                      description: 'AI 신뢰도 점수',
                    },
                    aiAnalysisResult: {
                      type: 'string',
                      example:
                        '이미지에서 러닝 관련 요소를 명확히 식별하기 어려워 검토가 필요합니다.',
                      description: 'AI 분석 결과',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-01-27T10:30:00.000Z',
                    },
                    user: {
                      type: 'object',
                      properties: {
                        userUuid: {
                          type: 'string',
                          example: '01JZZP4T40RB3H2SP70PKBJWNR',
                        },
                        nickname: {
                          type: 'string',
                          example: '시원한 포도',
                        },
                        profileImage: {
                          type: 'string',
                          example: 'https://example.com/profile.jpg',
                        },
                      },
                    },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  total: { type: 'number', example: 25 },
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  totalPages: { type: 'number', example: 3 },
                  hasNextPage: { type: 'boolean', example: true },
                  hasPrevPage: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없음',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'CHALLENGE_001' },
          message: { type: 'string', example: '챌린지를 찾을 수 없습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '서버 내부 오류',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'SYS_001' },
          message: { type: 'string', example: '서버 오류가 발생했습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}
