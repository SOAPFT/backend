import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateFriendRequestDto } from '../dto/create-friendrequest.dto';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../../decorators/swagger.decorator';

export function ApiSendFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 신청',
      description: '다른 사용자에게 친구 요청을 보냅니다.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: CreateFriendRequestDto }),
    ApiResponse({
      status: 201,
      description: '친구 요청 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '친구 요청이 전송되었습니다.' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('FRIENDSHIP_002', '이미 친구인 사용자입니다.', 409),
    ),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_005',
        '자기 자신에게 친구 요청을 보낼 수 없습니다.',
        400,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
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
    ApiResponse({
      status: 200,
      description: '친구 요청 수락 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '친구 요청을 수락했습니다.' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_004',
        '친구 요청을 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiRejectFriendRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 요청 거절',
      description: '받은 친구 요청을 거절하고 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '친구 요청 거절 및 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '친구 요청을 거절했습니다.' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_004',
        '친구 요청을 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiRemoveFriend() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 삭제',
      description: '친구 관계를 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '친구 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '친구가 삭제되었습니다.' },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'FRIENDSHIP_001',
        '친구 관계를 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetFriendList() {
  return applyDecorators(
    ApiOperation({
      summary: '친구 목록 조회',
      description:
        '사용자의 친구 목록을 조회합니다. 상대방 닉네임과 프로필 이미지 포함.',
    }),
    ApiBearerAuth(),
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
                friendId: { type: 'number', example: 1 },
                friendUuid: { type: 'string', example: '01HZQ...' },
                nickname: { type: 'string', example: '홍길동' },
                profileImage: {
                  type: 'string',
                  example: 'https://example.com/profile.jpg',
                },
                status: { type: 'string', example: 'ACCEPTED' },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-04T12:00:00Z',
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

export function ApiGetReceivedRequests() {
  return applyDecorators(
    ApiOperation({
      summary: '받은 친구 요청 목록 조회',
      description:
        '사용자가 받은 친구 요청 목록을 조회합니다. 요청자 닉네임과 프로필 이미지 포함.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '받은 친구 요청 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          receivedRequests: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                requestId: { type: 'number', example: 1 },
                requesterUuid: { type: 'string', example: '01HZQ...' },
                nickname: { type: 'string', example: '홍길동' },
                profileImage: {
                  type: 'string',
                  example: 'https://example.com/profile.jpg',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-04T12:00:00Z',
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

export function ApiGetSentRequests() {
  return applyDecorators(
    ApiOperation({
      summary: '보낸 친구 요청 목록 조회',
      description:
        '사용자가 보낸 친구 요청 목록을 조회합니다. 수신자 닉네임과 프로필 이미지 포함.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '보낸 친구 요청 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          sentRequests: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                requestId: { type: 'number', example: 1 },
                addresseeUuid: { type: 'string', example: '01HZQ...' },
                nickname: { type: 'string', example: '김영희' },
                profileImage: {
                  type: 'string',
                  example: 'https://example.com/profile.jpg',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-04T12:00:00Z',
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
