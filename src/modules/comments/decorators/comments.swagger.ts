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

export function ApiCreateComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 생성',
      description:
        '인증글에 댓글을 작성합니다. 대댓글과 사용자 멘션을 지원합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      schema: {
        type: 'object',
        required: ['postUuid', 'content'],
        properties: {
          postUuid: {
            type: 'string',
            description: '인증글 UUID',
            example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
          },
          content: {
            type: 'string',
            description: '댓글 내용',
            example: '정말 대단해요! 저도 열심히 해야겠어요 💪',
          },
          parentCommentId: {
            type: 'number',
            description: '부모 댓글 ID (대댓글인 경우)',
            example: 123,
          },
          mentionedUserUuids: {
            type: 'array',
            items: { type: 'string' },
            description: '멘션된 사용자 UUID 배열',
            example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '댓글이 성공적으로 생성됨',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 456,
          },
          content: {
            type: 'string',
            example: '정말 대단해요! 저도 열심히 해야겠어요 💪',
          },
          author: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              nickname: { type: 'string', example: '댓글러' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
          parentCommentId: {
            type: 'number',
            example: 123,
          },
          mentionedUsers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                nickname: { type: 'string', example: '운동러버' },
              },
            },
          },
          replyCount: {
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
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(
      createErrorResponse('POST_001', '인증글을 찾을 수 없습니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_001', '댓글 내용은 필수입니다.', 400),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_002', '댓글 내용이 너무 깁니다.', 400, {
        maxLength: 500,
      }),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_003', '존재하지 않는 부모 댓글입니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('USER_001', '언급된 사용자를 찾을 수 없습니다.', 404),
    ),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetAllComments() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 목록 조회',
      description: '특정 인증글의 댓글 목록을 조회합니다. 대댓글도 포함됩니다.',
    }),
    ApiParam({
      name: 'postUuid',
      description: '인증글 UUID',
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
      description: '페이지당 항목 수 (기본값: 20)',
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: '댓글 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 456 },
                content: {
                  type: 'string',
                  example: '정말 대단해요! 저도 열심히 해야겠어요 💪',
                },
                author: {
                  type: 'object',
                  properties: {
                    userUuid: {
                      type: 'string',
                      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                    },
                    nickname: { type: 'string', example: '댓글러' },
                    profileImage: {
                      type: 'string',
                      example: 'https://example.com/profile.jpg',
                    },
                  },
                },
                parentCommentId: { type: 'number', example: null },
                mentionedUsers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      userUuid: {
                        type: 'string',
                        example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                      },
                      nickname: { type: 'string', example: '운동러버' },
                    },
                  },
                },
                replies: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 789 },
                      content: {
                        type: 'string',
                        example: '감사합니다! 함께 화이팅해요 🔥',
                      },
                      author: {
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
                      parentCommentId: { type: 'number', example: 456 },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-06-22T12:30:00Z',
                      },
                    },
                  },
                },
                replyCount: { type: 'number', example: 1 },
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
              totalPages: { type: 'number', example: 3 },
              totalItems: { type: 'number', example: 45 },
              itemsPerPage: { type: 'number', example: 20 },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('POST_001', '인증글을 찾을 수 없습니다.', 404),
    ),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 상세 조회',
      description: '특정 댓글의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: 456,
    }),
    ApiResponse({
      status: 200,
      description: '댓글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 456 },
          content: {
            type: 'string',
            example: '정말 대단해요! 저도 열심히 해야겠어요 💪',
          },
          author: {
            type: 'object',
            properties: {
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              nickname: { type: 'string', example: '댓글러' },
              profileImage: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
              },
            },
          },
          post: {
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
            },
          },
          parentCommentId: { type: 'number', example: null },
          mentionedUsers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userUuid: {
                  type: 'string',
                  example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                },
                nickname: { type: 'string', example: '운동러버' },
              },
            },
          },
          replyCount: { type: 'number', example: 3 },
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
    ApiResponse({
      status: 404,
      description: '댓글을 찾을 수 없음',
    }),
  );
}

export function ApiUpdateComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 수정',
      description: '작성한 댓글을 수정합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: 456,
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'string',
            description: '수정할 댓글 내용',
            example: '정말 대단해요! 저도 더 열심히 해야겠어요 💪🔥',
          },
          mentionedUserUuids: {
            type: 'array',
            items: { type: 'string' },
            description: '멘션된 사용자 UUID 배열',
            example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '댓글 수정 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '댓글이 수정되었습니다.',
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
      description: '수정 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '댓글을 찾을 수 없음',
    }),
  );
}

export function ApiDeleteComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 삭제',
      description:
        '작성한 댓글을 삭제합니다. 대댓글이 있는 경우 내용만 삭제됩니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: 456,
    }),
    ApiResponse({
      status: 200,
      description: '댓글 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '댓글이 삭제되었습니다.',
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
      description: '삭제 권한 없음',
    }),
    ApiResponse({
      status: 404,
      description: '댓글을 찾을 수 없음',
    }),
  );
}
