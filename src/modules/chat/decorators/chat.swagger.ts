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

export function ApiFindOrCreateDirectRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '1대1 채팅방 찾기 또는 생성',
      description:
        '대상 사용자와의 1대1 채팅방이 존재하면 해당 채팅방을 반환하고, 없으면 새로 생성합니다. 친구 관계인 경우에만 생성 가능합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'targetUserUuid',
      description: '대상 사용자 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '1대1 채팅방 조회/생성 성공',
      schema: {
        type: 'object',
        properties: {
          roomUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          type: {
            type: 'string',
            enum: ['DIRECT'],
            example: 'DIRECT',
          },
          name: {
            type: 'string',
            example: '운동러버',
          },
          participants: {
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
              },
            },
          },
          challengeUuid: {
            type: 'string',
            example: null,
          },
          lastMessage: {
            type: 'object',
            example: null,
          },
          lastMessageAt: {
            type: 'string',
            format: 'date-time',
            example: null,
          },
          unreadCount: {
            type: 'number',
            example: 0,
          },
          isNewRoom: {
            type: 'boolean',
            example: true,
            description: '새로 생성된 채팅방인지 여부',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 (존재하지 않는 사용자 등)',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 403,
      description: '친구가 아닌 사용자와는 채팅할 수 없습니다',
    }),
    ApiResponse({
      status: 404,
      description: '대상 사용자를 찾을 수 없습니다',
    }),
  );
}

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 생성',
      description:
        '1대1 또는 그룹 채팅방을 생성합니다. 친구와의 1대1 채팅만 생성 가능합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['type', 'participantUuids'],
        properties: {
          type: {
            type: 'string',
            enum: ['DIRECT', 'GROUP'],
            description: '채팅방 타입',
            example: 'DIRECT',
          },
          participantUuids: {
            type: 'array',
            items: { type: 'string' },
            description: '참여자 UUID 배열 (1대1: 1개, 그룹: 여러개)',
            example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],
            minItems: 1,
            maxItems: 50,
          },
          name: {
            type: 'string',
            description: '채팅방 이름 (그룹 채팅방인 경우)',
            example: '30일 헬스 챌린지 채팅방',
            maxLength: 50,
          },
          challengeUuid: {
            type: 'string',
            description: '챌린지 UUID (챌린지 그룹 채팅인 경우)',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '채팅방이 성공적으로 생성됨',
      schema: {
        type: 'object',
        properties: {
          roomUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          type: {
            type: 'string',
            enum: ['DIRECT', 'GROUP'],
            example: 'DIRECT',
          },
          name: {
            type: 'string',
            example: '운동러버, 헬스마니아',
          },
          participantUuids: {
            type: 'array',
            items: { type: 'string' },
            example: [
              '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              '01HZQK5J8X2M3N4P5Q6R7S8T9W',
            ],
          },
          challengeUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          lastMessage: {
            type: 'object',
            example: null,
          },
          lastMessageAt: {
            type: 'string',
            format: 'date-time',
            example: null,
          },
          unreadCount: {
            type: 'number',
            example: 0,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 (친구가 아닌 사용자와 채팅방 생성 시도 등)',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 409,
      description: '이미 존재하는 채팅방',
    }),
  );
}

export function ApiGetChatRooms() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 목록 조회',
      description: '사용자가 참여 중인 채팅방 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'type',
      required: false,
      description: '채팅방 타입 필터',
      enum: ['DIRECT', 'GROUP'],
      example: 'DIRECT',
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
      description: '채팅방 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          chatRooms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                roomUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                type: {
                  type: 'string',
                  enum: ['DIRECT', 'GROUP'],
                  example: 'DIRECT',
                },
                name: { type: 'string', example: '운동러버, 헬스마니아' },
                participants: {
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
                      isOnline: { type: 'boolean', example: true },
                      lastSeenAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-06-22T12:00:00Z',
                      },
                    },
                  },
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
                lastMessage: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 123 },
                    content: {
                      type: 'string',
                      example: '오늘도 운동 완료! 💪',
                    },
                    type: {
                      type: 'string',
                      enum: ['TEXT', 'IMAGE', 'SYSTEM'],
                      example: 'TEXT',
                    },
                    sender: {
                      type: 'object',
                      properties: {
                        userUuid: {
                          type: 'string',
                          example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                        },
                        nickname: { type: 'string', example: '운동러버' },
                      },
                    },
                    sentAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-06-22T12:00:00Z',
                    },
                  },
                },
                unreadCount: { type: 'number', example: 3 },
                isPinned: { type: 'boolean', example: false },
                isMuted: { type: 'boolean', example: false },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:30:00Z',
                },
              },
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

export function ApiGetChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 상세 조회',
      description: '특정 채팅방의 상세 정보를 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '채팅방 상세 조회 성공',
      schema: {
        type: 'object',
        properties: {
          roomUuid: { type: 'string', example: '01HZQK5J8X2M3N4P5Q6R7S8T9V' },
          type: {
            type: 'string',
            enum: ['DIRECT', 'GROUP'],
            example: 'DIRECT',
          },
          name: { type: 'string', example: '운동러버, 헬스마니아' },
          participants: {
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
                isOnline: { type: 'boolean', example: true },
                lastSeenAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                joinedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
              },
            },
          },
          challenge: {
            type: 'object',
            properties: {
              challengeUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              title: { type: 'string', example: '30일 헬스 챌린지' },
              isActive: { type: 'boolean', example: true },
            },
          },
          myRole: {
            type: 'string',
            enum: ['PARTICIPANT', 'ADMIN'],
            example: 'PARTICIPANT',
          },
          settings: {
            type: 'object',
            properties: {
              isPinned: { type: 'boolean', example: false },
              isMuted: { type: 'boolean', example: false },
              notificationEnabled: { type: 'boolean', example: true },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:30:00Z',
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
      description: '채팅방 접근 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '채팅방을 찾을 수 없음',
    }),
  );
}

export function ApiLeaveChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 나가기',
      description: '채팅방에서 나갑니다. 1대1 채팅방은 나갈 수 없습니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '채팅방 나가기 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '채팅방에서 나갔습니다.',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '1대1 채팅방은 나갈 수 없음',
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
    ApiResponse({
      status: 403,
      description: '채팅방 접근 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '채팅방을 찾을 수 없음',
    }),
  );
}

// ==================== 메시지 관련 API ====================

export function ApiSendMessage() {
  return applyDecorators(
    ApiOperation({
      summary: '메시지 전송',
      description: '채팅방에 메시지를 전송합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['content', 'type'],
        properties: {
          content: {
            type: 'string',
            description: '메시지 내용',
            example: '오늘도 운동 완료! 💪',
            maxLength: 1000,
          },
          type: {
            type: 'string',
            enum: ['TEXT', 'IMAGE'],
            description: '메시지 타입',
            example: 'TEXT',
          },
          imageUrl: {
            type: 'string',
            description: '이미지 URL (타입이 IMAGE인 경우)',
            example:
              'https://soapft-bucket.s3.amazonaws.com/images/workout.jpg',
          },
          replyToMessageId: {
            type: 'number',
            description: '답장할 메시지 ID',
            example: 123,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '메시지 전송 성공',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 456,
          },
          roomUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          content: {
            type: 'string',
            example: '오늘도 운동 완료! 💪',
          },
          type: {
            type: 'string',
            enum: ['TEXT', 'IMAGE'],
            example: 'TEXT',
          },
          imageUrl: {
            type: 'string',
            example:
              'https://soapft-bucket.s3.amazonaws.com/images/workout.jpg',
          },
          sender: {
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
            },
          },
          replyTo: {
            type: 'object',
            properties: {
              messageId: { type: 'number', example: 123 },
              content: { type: 'string', example: '오늘 운동 어떠셨나요?' },
              sender: {
                type: 'object',
                properties: {
                  userUuid: {
                    type: 'string',
                    example: '01HZQK5J8X2M3N4P5Q6R7S8T9W',
                  },
                  nickname: { type: 'string', example: '헬스마니아' },
                },
              },
            },
          },
          readByUuids: {
            type: 'array',
            items: { type: 'string' },
            example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],
          },
          sentAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(
      createErrorResponse('CHAT_002', '채팅방 참여 권한이 없습니다.', 403),
    ),
    ApiResponse(
      createErrorResponse('CHAT_001', '채팅방을 찾을 수 없습니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('CHAT_003', '메시지 내용은 필수입니다.', 400),
    ),
    ApiResponse(
      createErrorResponse('CHAT_007', '메시지 전송에 실패했습니다.', 500),
    ),
    ApiResponse(
      createErrorResponse(
        'CHAT_009',
        '친구가 아닌 사용자와는 채팅할 수 없습니다.',
        403,
      ),
    ),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetMessages() {
  return applyDecorators(
    ApiOperation({
      summary: '메시지 목록 조회',
      description: '채팅방의 메시지 목록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
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
      description: '페이지당 메시지 수 (기본값: 50)',
      example: 50,
    }),
    ApiQuery({
      name: 'lastMessageId',
      required: false,
      description: '마지막 메시지 ID (이전 메시지 로드용)',
      example: 1234,
    }),
    ApiResponse({
      status: 200,
      description: '메시지 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 456 },
                content: { type: 'string', example: '오늘도 운동 완료! 💪' },
                type: {
                  type: 'string',
                  enum: ['TEXT', 'IMAGE', 'SYSTEM'],
                  example: 'TEXT',
                },
                imageUrl: {
                  type: 'string',
                  example: 'https://example.com/image.jpg',
                },
                sender: {
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
                  },
                },
                replyTo: {
                  type: 'object',
                  properties: {
                    messageId: { type: 'number', example: 123 },
                    content: {
                      type: 'string',
                      example: '오늘 운동 어떠셨나요?',
                    },
                    sender: {
                      type: 'object',
                      properties: {
                        userUuid: {
                          type: 'string',
                          example: '01HZQK5J8X2M3N4P5Q6R7S8T9W',
                        },
                        nickname: { type: 'string', example: '헬스마니아' },
                      },
                    },
                  },
                },
                readByUuids: {
                  type: 'array',
                  items: { type: 'string' },
                  example: [
                    '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                    '01HZQK5J8X2M3N4P5Q6R7S8T9W',
                  ],
                },
                isEdited: { type: 'boolean', example: false },
                isDeleted: { type: 'boolean', example: false },
                sentAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                editedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: null,
                },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 10 },
              totalItems: { type: 'number', example: 500 },
              itemsPerPage: { type: 'number', example: 50 },
              hasNext: { type: 'boolean', example: true },
            },
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
      description: '채팅방 접근 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '채팅방을 찾을 수 없음',
    }),
  );
}

export function ApiMarkMessagesAsRead() {
  return applyDecorators(
    ApiOperation({
      summary: '메시지 읽음 처리',
      description: '채팅방의 메시지들을 읽음으로 표시합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          lastReadMessageId: {
            type: 'number',
            description: '마지막으로 읽은 메시지 ID',
            example: 456,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '메시지 읽음 처리 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '메시지를 읽음으로 표시했습니다.',
          },
          readCount: {
            type: 'number',
            example: 15,
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
      description: '채팅방 접근 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '채팅방을 찾을 수 없음',
    }),
  );
}

export function ApiDeleteMessage() {
  return applyDecorators(
    ApiOperation({
      summary: '메시지 삭제',
      description: '본인이 보낸 메시지를 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'roomUuid',
      description: '채팅방 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiParam({
      name: 'messageId',
      description: '메시지 ID',
      example: 456,
    }),
    ApiResponse({
      status: 200,
      description: '메시지 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '메시지가 삭제되었습니다.',
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
      description: '삭제 권한 없음 (본인 메시지가 아님)',
    }),
    ApiResponse({
      status: 404,
      description: '메시지를 찾을 수 없음',
    }),
  );
}
