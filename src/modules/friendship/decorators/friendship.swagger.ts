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

// ==================== 친구 관계 관리 API ====================

export function ApiSendFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 보내기',
      description: '다른 사용자에게 친구 요청을 보냅니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['addresseeUuid'],
        properties: {
          addresseeUuid: {
            type: 'string',
            description: '친구 요청을 받을 사용자의 UUID',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          message: {
            type: 'string',
            description: '친구 요청 메시지',
            example: '안녕하세요! 같이 운동해요 😊',
            maxLength: 200,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '친구 요청이 성공적으로 전송됨',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 123,
          },
          requesterUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9W',
          },
          addresseeUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'],
            example: 'PENDING',
          },
          message: {
            type: 'string',
            example: '안녕하세요! 같이 운동해요 😊',
          },
          requestedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_004',
        '본인에게는 친구 요청을 보낼 수 없습니다.',
        400,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_001',
        '이미 친구 요청을 보냈습니다.',
        400,
      ),
    ),
    ApiResponse(createErrorResponse('FRIENDSHIP_002', '이미 친구입니다.', 400)),
    ApiResponse(
      createErrorResponse('FRIENDSHIP_007', '차단된 사용자입니다.', 400),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(
      createErrorResponse('USER_001', '사용자를 찾을 수 없습니다.', 404),
    ),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_006',
        '친구 요청 처리에 실패했습니다.',
        500,
      ),
    ),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiAcceptFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 수락',
      description: '받은 친구 요청을 수락합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'friendshipId',
      description: '친구 관계 ID',
      example: 123,
    }),
    ApiResponse({
      status: 200,
      description: '친구 요청 수락 성공',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 123,
          },
          requester: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9W',
              },
              nickname: { type: 'string', example: '운동러버' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
              age: { type: 'number', example: 25 },
              gender: {
                type: 'string',
                enum: ['MALE', 'FEMALE', 'OTHER'],
                example: 'MALE',
              },
            },
          },
          addressee: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              nickname: { type: 'string', example: '헬스마니아' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile2.jpg',
              },
              age: { type: 'number', example: 27 },
              gender: {
                type: 'string',
                enum: ['MALE', 'FEMALE', 'OTHER'],
                example: 'FEMALE',
              },
            },
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'],
            example: 'ACCEPTED',
          },
          message: {
            type: 'string',
            example: '안녕하세요! 같이 운동해요 😊',
          },
          requestedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
          respondedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:30:00Z',
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonAuthResponses.Forbidden),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_003',
        '친구 요청을 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(
      createErrorResponse('FRIENDSHIP_008', '친구 요청이 거절되었습니다.', 400),
    ),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_006',
        '친구 요청 처리에 실패했습니다.',
        500,
      ),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiRejectFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 거절',
      description: '받은 친구 요청을 거절합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'friendshipId',
      description: '친구 관계 ID',
      example: 123,
    }),
    ApiResponse({
      status: 200,
      description: '친구 요청 거절 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '친구 요청을 거절했습니다.',
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
      description: '친구 요청 거절 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '친구 요청을 찾을 수 없음',
    }),
  );
}

export function ApiCancelFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 취소',
      description: '보낸 친구 요청을 취소합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'friendshipId',
      description: '친구 관계 ID',
      example: 123,
    }),
    ApiResponse({
      status: 200,
      description: '친구 요청 취소 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '친구 요청을 취소했습니다.',
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
      description: '친구 요청 취소 권한 없음 (요청 보낸 사람이 아님)',
    }),
    ApiResponse({
      status: 404,
      description: '친구 요청을 찾을 수 없음',
    }),
  );
}

export function ApiUnfriend() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 삭제',
      description: '친구 관계를 해제합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'friendshipId',
      description: '친구 관계 ID',
      example: 123,
    }),
    ApiResponse({
      status: 200,
      description: '친구 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '친구 관계가 해제되었습니다.',
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
      description: '친구 삭제 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '친구 관계를 찾을 수 없음',
    }),
  );
}

export function ApiBlockUser() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 차단',
      description: '특정 사용자를 차단합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['blockedUserUuid'],
        properties: {
          blockedUserUuid: {
            type: 'string',
            description: '차단할 사용자의 UUID',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          reason: {
            type: 'string',
            description: '차단 사유',
            example: '스팸/광고',
            maxLength: 200,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '사용자 차단 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '사용자를 차단했습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 (자기 자신 차단 시도 등)',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 409,
      description: '이미 차단된 사용자',
    }),
  );
}

export function ApiUnblockUser() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 차단 해제',
      description: '차단된 사용자를 차단 해제합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'friendshipId',
      description: '친구 관계 ID (차단 관계)',
      example: 123,
    }),
    ApiResponse({
      status: 200,
      description: '차단 해제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '차단을 해제했습니다.',
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
      description: '차단 해제 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '차단 관계를 찾을 수 없음',
    }),
  );
}

// ==================== 친구 목록 조회 API ====================

export function ApiGetFriends() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 목록 조회',
      description: '현재 사용자의 친구 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'search',
      required: false,
      description: '친구 검색 키워드 (닉네임)',
      example: '운동',
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
      description: '페이지당 항목 수 (기본값: 20)',
      example: 20,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description: '정렬 기준',
      enum: ['nickname', 'recently_added', 'last_activity'],
      example: 'nickname',
    }),
    ApiResponse({
      status: 200,
      description: '친구 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          friends: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                friendshipId: { type: 'number', example: 123 },
                friend: {
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
                    statusMessage: {
                      type: 'string',
                      example: '오늘도 화이팅! 💪',
                    },
                    age: { type: 'number', example: 25 },
                    gender: {
                      type: 'string',
                      enum: ['MALE', 'FEMALE', 'OTHER'],
                      example: 'MALE',
                    },
                    isOnline: { type: 'boolean', example: true },
                    lastSeenAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-06-22T12:00:00Z',
                    },
                  },
                },
                becameFriendsAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-20T10:00:00Z',
                },
                mutualFriendsCount: { type: 'number', example: 5 },
                commonChallengesCount: { type: 'number', example: 2 },
              },
            },
          },
          statistics: {
            type: 'object',
            properties: {
              totalFriends: { type: 'number', example: 45 },
              onlineFriends: { type: 'number', example: 12 },
              mutualFriends: { type: 'number', example: 8 },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 3 },
              totalItems: { type: 'number', example: 45 },
              itemsPerPage: { type: 'number', example: 20 },
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

export function ApiGetFriendRequests() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 목록 조회',
      description: '받은 친구 요청과 보낸 친구 요청 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'type',
      required: false,
      description: '친구 요청 타입',
      enum: ['received', 'sent', 'all'],
      example: 'received',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: '친구 요청 상태',
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      example: 'PENDING',
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
      description: '페이지당 항목 수 (기본값: 20)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: '친구 요청 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          friendRequests: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 123 },
                type: {
                  type: 'string',
                  enum: ['received', 'sent'],
                  example: 'received',
                },
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
                    age: { type: 'number', example: 25 },
                    gender: {
                      type: 'string',
                      enum: ['MALE', 'FEMALE', 'OTHER'],
                      example: 'MALE',
                    },
                  },
                },
                status: {
                  type: 'string',
                  enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'],
                  example: 'PENDING',
                },
                message: {
                  type: 'string',
                  example: '안녕하세요! 같이 운동해요 😊',
                },
                requestedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                respondedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: null,
                },
                mutualFriendsCount: { type: 'number', example: 3 },
              },
            },
          },
          statistics: {
            type: 'object',
            properties: {
              totalPending: { type: 'number', example: 8 },
              totalReceived: { type: 'number', example: 5 },
              totalSent: { type: 'number', example: 3 },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 2 },
              totalItems: { type: 'number', example: 25 },
              itemsPerPage: { type: 'number', example: 20 },
            },
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetBlockedUsers() {
  return applyDecorators(
    ApiOperation({
      summary: '차단된 사용자 목록 조회',
      description: '차단한 사용자 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호 (기본값: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 항목 수 (기본값: 20)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: '차단된 사용자 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          blockedUsers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 123 },
                blockedUser: {
                  type: 'object',
                  properties: {
                    userUuid: {
                      type: 'string',
                      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                    },
                    nickname: { type: 'string', example: '차단된사용자' },
                    profileImage: {
                      type: 'string',
                      example: 'https://example.com/profile.jpg',
                    },
                  },
                },
                reason: { type: 'string', example: '스팸/광고' },
                blockedAt: {
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
              totalPages: { type: 'number', example: 1 },
              totalItems: { type: 'number', example: 3 },
              itemsPerPage: { type: 'number', example: 20 },
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

// ==================== 사용자 검색 API ====================

export function ApiSearchUsers() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 검색',
      description: '닉네임으로 사용자를 검색하여 친구 요청을 보낼 수 있습니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'query',
      required: true,
      description: '검색할 닉네임',
      example: '운동',
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
      name: 'excludeFriends',
      required: false,
      description: '이미 친구인 사용자 제외 여부',
      example: true,
    }),
    ApiResponse({
      status: 200,
      description: '사용자 검색 성공',
      schema: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
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
                statusMessage: { type: 'string', example: '오늘도 화이팅! 💪' },
                age: { type: 'number', example: 25 },
                gender: {
                  type: 'string',
                  enum: ['MALE', 'FEMALE', 'OTHER'],
                  example: 'MALE',
                },
                friendshipStatus: {
                  type: 'string',
                  enum: [
                    'NONE',
                    'PENDING_SENT',
                    'PENDING_RECEIVED',
                    'FRIENDS',
                    'BLOCKED',
                  ],
                  example: 'NONE',
                },
                mutualFriendsCount: { type: 'number', example: 3 },
                isOnline: { type: 'boolean', example: true },
                lastSeenAt: {
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
              totalPages: { type: 'number', example: 2 },
              totalItems: { type: 'number', example: 15 },
              itemsPerPage: { type: 'number', example: 10 },
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
