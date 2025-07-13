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
  CommonErrorResponses,
  CommonAuthResponses,
  createErrorResponse,
} from '@/decorators/swagger.decorator';

export function ApiCreateNotification() {
  return applyDecorators(
    ApiOperation({
      summary: '알림 생성',
      description: '새로운 알림을 생성합니다. (시스템용)',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['recipientUuid', 'type', 'title', 'content'],
        properties: {
          recipientUuid: {
            type: 'string',
            description: '수신자 UUID',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          senderUuid: {
            type: 'string',
            description: '발신자 UUID (선택적)',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          type: {
            type: 'string',
            enum: [
              'friend_request',
              'friend_accepted',
              'challenge_invite',
              'challenge_start',
              'challenge_end',
              'new_message',
              'post_like',
              'post_comment',
              'mention',
            ],
            description: '알림 타입',
            example: 'friend_request',
          },
          title: {
            type: 'string',
            description: '알림 제목',
            example: '친구 요청이 도착했습니다',
          },
          content: {
            type: 'string',
            description: '알림 내용',
            example: '김철수님이 친구 요청을 보냈습니다.',
          },
          data: {
            type: 'object',
            description: '추가 데이터 (JSON)',
            example: { friendRequestId: 123 },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '알림이 성공적으로 생성됨',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          recipientUuid: {
            type: 'string',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          senderUuid: { type: 'string', example: '01HZQK5J8X2M3N4P5Q6R7S8T9V' },
          type: { type: 'string', example: 'friend_request' },
          title: { type: 'string', example: '친구 요청이 도착했습니다' },
          content: {
            type: 'string',
            example: '김철수님이 친구 요청을 보냈습니다.',
          },
          data: { type: 'object', example: { friendRequestId: 123 } },
          isRead: { type: 'boolean', example: false },
          isSent: { type: 'boolean', example: false },
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
    ApiResponse(CommonErrorResponses.NotFound),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetNotifications() {
  return applyDecorators(
    ApiOperation({
      summary: '알림 목록 조회',
      description: '사용자의 알림 목록을 페이지네이션으로 조회합니다.',
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
      name: 'unreadOnly',
      required: false,
      description: '미읽음 알림만 조회',
      example: false,
    }),
    ApiQuery({
      name: 'type',
      required: false,
      description: '알림 타입 필터',
      enum: [
        'friend_request',
        'friend_accepted',
        'challenge_invite',
        'challenge_start',
        'challenge_end',
        'new_message',
        'post_like',
        'post_comment',
        'mention',
      ],
    }),
    ApiResponse({
      status: 200,
      description: '알림 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          notifications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                recipientUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                senderUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                type: { type: 'string', example: 'friend_request' },
                title: { type: 'string', example: '친구 요청이 도착했습니다' },
                content: {
                  type: 'string',
                  example: '김철수님이 친구 요청을 보냈습니다.',
                },
                data: { type: 'object', example: { friendRequestId: 123 } },
                isRead: { type: 'boolean', example: false },
                isSent: { type: 'boolean', example: true },
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
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: { type: 'number', example: 1 },
              totalPages: { type: 'number', example: 5 },
              totalItems: { type: 'number', example: 100 },
              itemsPerPage: { type: 'number', example: 20 },
            },
          },
          unreadCount: { type: 'number', example: 5 },
        },
      },
    }),
  );
}

export function ApiGetUnreadCount() {
  return applyDecorators(
    ApiOperation({
      summary: '미읽음 알림 개수 조회',
      description: '사용자의 미읽음 알림 개수를 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '미읽음 알림 개수 조회 성공',
      schema: {
        type: 'object',
        properties: {
          unreadCount: { type: 'number', example: 5 },
        },
      },
    }),
  );
}

export function ApiMarkAsRead() {
  return applyDecorators(
    ApiOperation({
      summary: '알림 읽음 처리',
      description:
        '지정된 알림들을 읽음 상태로 변경합니다. notificationIds가 없으면 모든 미읽음 알림을 읽음 처리합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          notificationIds: {
            type: 'array',
            items: { type: 'number' },
            description: '읽음 처리할 알림 ID 배열 (선택적)',
            example: [1, 2, 3],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '알림 읽음 처리 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: '3개의 알림이 읽음 처리되었습니다.',
          },
        },
      },
    }),
  );
}

export function ApiDeleteNotification() {
  return applyDecorators(
    ApiOperation({
      summary: '알림 삭제',
      description: '지정된 알림을 삭제합니다.',
    }),
    ApiParam({
      name: 'id',
      description: '삭제할 알림 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '알림 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '알림이 삭제되었습니다.' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_001',
        '해당 알림을 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiSendPush() {
  return applyDecorators(
    ApiOperation({
      summary: '푸시알림 전송',
      description: '단일 디바이스에 푸시알림을 전송합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['deviceToken', 'title', 'body'],
        properties: {
          deviceToken: {
            type: 'string',
            description: '디바이스 토큰',
            example:
              'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
          },
          title: {
            type: 'string',
            description: '푸시알림 제목',
            example: '새로운 메시지',
          },
          body: {
            type: 'string',
            description: '푸시알림 내용',
            example: '김철수님이 메시지를 보냈습니다.',
          },
          badge: {
            type: 'number',
            description: '배지 수',
            example: 1,
          },
          sound: {
            type: 'string',
            description: '알림 소리',
            example: 'default',
          },
          data: {
            type: 'object',
            description: '추가 데이터',
            example: { messageId: 123, type: 'message' },
          },
          category: {
            type: 'string',
            description: '알림 카테고리',
            example: 'MESSAGE_CATEGORY',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '푸시알림 전송 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          sent: { type: 'number', example: 1 },
          failed: { type: 'number', example: 0 },
          invalidTokens: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_005',
        'APNs 푸시 서비스가 초기화되지 않았습니다.',
        503,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_006',
        'APNs 서버 연결에 실패했습니다.',
        502,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_007',
        '유효하지 않은 디바이스 토큰입니다.',
        400,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_008',
        'APNs 서비스 설정에 오류가 있습니다.',
        500,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiSendPushMultiple() {
  return applyDecorators(
    ApiOperation({
      summary: '다중 푸시알림 전송',
      description: '여러 디바이스에 푸시알림을 동시에 전송합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['deviceTokens', 'title', 'body'],
        properties: {
          deviceTokens: {
            type: 'array',
            items: { type: 'string' },
            description: '디바이스 토큰 배열',
            example: [
              'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
              'b8c1fe21f0dfe133b72dc19864g50d6b1c1egc484708cgag851b1104eb20d8',
            ],
          },
          title: {
            type: 'string',
            description: '푸시알림 제목',
            example: '새로운 공지사항',
          },
          body: {
            type: 'string',
            description: '푸시알림 내용',
            example: '새로운 업데이트가 있습니다.',
          },
          badge: {
            type: 'number',
            description: '배지 수',
            example: 1,
          },
          sound: {
            type: 'string',
            description: '알림 소리',
            example: 'default',
          },
          data: {
            type: 'object',
            description: '추가 데이터',
            example: { announcementId: 456, type: 'announcement' },
          },
          category: {
            type: 'string',
            description: '알림 카테고리',
            example: 'ANNOUNCEMENT_CATEGORY',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '푸시알림 전송 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          sent: { type: 'number', example: 2 },
          failed: { type: 'number', example: 0 },
          invalidTokens: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_005',
        'APNs 푸시 서비스가 초기화되지 않았습니다.',
        503,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_006',
        'APNs 서버 연결에 실패했습니다.',
        502,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_007',
        '유효하지 않은 디바이스 토큰입니다.',
        400,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_008',
        'APNs 서비스 설정에 오류가 있습니다.',
        500,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiSendTestPush() {
  return applyDecorators(
    ApiOperation({
      summary: '테스트 푸시알림 전송',
      description: '테스트용 푸시알림을 전송합니다.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['deviceToken'],
        properties: {
          deviceToken: {
            type: 'string',
            description: '디바이스 토큰',
            example:
              'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '테스트 푸시알림 전송 성공',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          sent: { type: 'number', example: 1 },
          failed: { type: 'number', example: 0 },
          invalidTokens: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
          message: {
            type: 'string',
            example: '테스트 푸시알림이 전송되었습니다.',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_005',
        'APNs 푸시 서비스가 초기화되지 않았습니다.',
        503,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_006',
        'APNs 서버 연결에 실패했습니다.',
        502,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_007',
        '유효하지 않은 디바이스 토큰입니다.',
        400,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_008',
        'APNs 서비스 설정에 오류가 있습니다.',
        500,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetPushStatus() {
  return applyDecorators(
    ApiOperation({
      summary: '푸시알림 서비스 상태 확인',
      description: 'APNs 푸시알림 서비스의 연결 상태를 확인합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '푸시알림 서비스 상태 조회 성공',
      schema: {
        type: 'object',
        properties: {
          isReady: { type: 'boolean', example: true },
          status: {
            type: 'string',
            example: 'connected',
            enum: ['connected', 'disconnected', 'initializing', 'error'],
          },
          message: {
            type: 'string',
            example: 'APNs 서비스가 정상적으로 동작중입니다.',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_005',
        'APNs 푸시 서비스가 초기화되지 않았습니다.',
        503,
      ),
    ),
    ApiResponse(
      createErrorResponse(
        'NOTIFICATION_008',
        'APNs 서비스 설정에 오류가 있습니다.',
        500,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}
