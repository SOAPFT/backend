import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../../decorators/swagger.decorator';

export function ApiGetUserInfo() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 정보 조회',
      description: '현재 로그인한 사용자의 정보를 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '사용자 정보 조회 성공',
      schema: {
        type: 'object',
        properties: {
          userUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          nickname: {
            type: 'string',
            example: '운동러버',
          },
          socialNickname: {
            type: 'string',
            example: '카카오_운동러버',
          },
          profileImage: {
            type: 'string',
            example: 'https://example.com/profile.jpg',
          },
          socialProvider: {
            type: 'string',
            enum: ['KAKAO', 'NAVER', 'APPLE'],
            example: 'KAKAO',
          },
          introduction: {
            type: 'string',
            example: '건강한 삶을 추구하는 운동 애호가입니다!',
          },
          age: {
            type: 'number',
            example: 28,
          },
          gender: {
            type: 'string',
            enum: ['MALE', 'FEMALE'],
            example: 'MALE',
          },
          coins: {
            type: 'number',
            example: 5000,
          },
          isPushEnabled: {
            type: 'boolean',
            example: true,
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            example: 'ACTIVE',
          },
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
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({
      summary: '프로필 수정',
      description: '사용자의 프로필 정보를 수정합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          nickname: {
            type: 'string',
            description: '닉네임',
            example: '새로운닉네임',
            minLength: 2,
            maxLength: 20,
          },
          profileImage: {
            type: 'string',
            description: '프로필 이미지 URL',
            example:
              'https://soapft-bucket.s3.amazonaws.com/images/new-profile.jpg',
          },
          introduction: {
            type: 'string',
            description: '자기소개',
            example: '더욱 건강한 삶을 위해 노력하고 있습니다!',
            maxLength: 200,
          },
          age: {
            type: 'number',
            description: '연령',
            example: 29,
            minimum: 14,
            maximum: 100,
          },
          gender: {
            type: 'string',
            enum: ['MALE', 'FEMALE'],
            description: '성별',
            example: 'MALE',
          },
          isPushEnabled: {
            type: 'boolean',
            description: '푸시 알림 활성화 여부',
            example: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '프로필 수정 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '프로필이 수정되었습니다.',
          },
          user: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              nickname: { type: 'string', example: '새로운닉네임' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/new-profile.jpg',
              },
              introduction: {
                type: 'string',
                example: '더욱 건강한 삶을 위해 노력하고 있습니다!',
              },
              age: { type: 'number', example: 29 },
              gender: { type: 'string', example: 'MALE' },
              isPushEnabled: { type: 'boolean', example: true },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-06-22T12:30:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('USER_002', '이미 사용 중인 닉네임입니다.', 400),
    ),
    ApiResponse(
      createErrorResponse('USER_003', '닉네임은 2-20자 사이여야 합니다.', 400, {
        minLength: 2,
        maxLength: 20,
      }),
    ),
    ApiResponse(
      createErrorResponse('USER_004', '연령은 14-100세 사이여야 합니다.', 400, {
        minAge: 14,
        maxAge: 100,
      }),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

/**
 * 로그아웃 API
 */
export function ApiLogout() {
  return applyDecorators(
    ApiOperation({
      summary: '로그아웃',
      description: '사용자를 로그아웃하고 리프레시 토큰을 무효화합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
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
            example: '로그아웃이 완료되었습니다.',
            description: '응답 메시지',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00.000Z',
            description: '응답 시각',
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: '회원 탈퇴',
      description: '사용자 계정을 삭제합니다. 모든 데이터가 삭제됩니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '회원 탈퇴 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '회원 탈퇴가 완료되었습니다.',
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetUserPosts() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 인증글 조회',
      description: '특정 사용자가 작성한 인증글 목록을 조회합니다.',
    }),
    ApiParam({
      name: 'userUuid',
      description: '사용자 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
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
    ApiResponse({
      status: 200,
      description: '사용자 인증글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              nickname: { type: 'string', example: '운동러버' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
              introduction: {
                type: 'string',
                example: '건강한 삶을 추구하는 운동 애호가입니다!',
              },
            },
          },
          posts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                postUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                content: {
                  type: 'string',
                  example: '오늘 헬스장에서 2시간 운동했어요! 💪',
                },
                imageUrl: {
                  type: 'array',
                  items: { type: 'string' },
                  example: [
                    'https://soapft-bucket.s3.amazonaws.com/images/workout1.jpg',
                  ],
                },
                challenge: {
                  type: 'object',
                  properties: {
                    challengeUuid: {
                      type: 'string',
                      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                    },
                    title: { type: 'string', example: '30일 헬스 챌린지' },
                  },
                },
                likeCount: { type: 'number', example: 15 },
                commentCount: { type: 'number', example: 3 },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 5 },
              totalItems: { type: 'number', example: 50 },
              itemsPerPage: { type: 'number', example: 10 },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없음',
    }),
  );
}

export function ApiGetUserChallenges() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 참여 챌린지 조회',
      description: '현재 로그인한 사용자가 참여 중인 챌린지 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'status',
      required: false,
      description: '챌린지 상태 필터',
      enum: ['recruiting', 'ongoing', 'finished'],
      example: 'ongoing',
    }),
    ApiResponse({
      status: 200,
      description: '사용자 참여 챌린지 조회 성공',
      schema: {
        type: 'object',
        properties: {
          challenges: {
            type: 'array',
            items: {
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
                startDate: {
                  type: 'string',
                  format: 'date',
                  example: '2025-07-01',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  example: '2025-07-31',
                },
                goal: { type: 'number', example: 5 },
                currentMember: { type: 'number', example: 25 },
                maxMember: { type: 'number', example: 50 },
                coinAmount: { type: 'number', example: 1000 },
                isStarted: { type: 'boolean', example: true },
                isFinished: { type: 'boolean', example: false },
                joinedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                myPostCount: { type: 'number', example: 15 },
                weeklyGoalAchieved: { type: 'number', example: 3 },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
  );
}
