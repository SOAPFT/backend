import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { createErrorResponse } from '../../../decorators/swagger.decorator';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

export function ApiCreateComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 생성',
      description:
        '게시글에 댓글을 작성합니다. parentCommentId가 있으면 대댓글로 등록됩니다.',
    }),
    ApiBearerAuth(),
    ApiBody({ type: CreateCommentDto }),
    ApiResponse({
      status: 201,
      description: '댓글 생성 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '댓글이 성공적으로 생성되었습니다.',
          },
          comment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              postUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              userUuid: {
                type: 'string',
                example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
              },
              content: {
                type: 'string',
                example: '댓글 내용입니다.',
              },
              parentCommentId: {
                type: 'number',
                example: 5,
                nullable: true,
              },
              mentionedUsers: {
                type: 'array',
                items: { type: 'string' },
                example: ['nickname1', 'nickname2'],
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-07-04T12:00:00Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-07-04T12:00:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse(
        'COMMENT_008',
        '댓글을 작성할 인증글을 찾을 수 없습니다.',
        404,
      ),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_006', '부모 댓글을 찾을 수 없습니다.', 404),
    ),
  );
}
export function ApiGetAllComments() {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 댓글 목록 조회',
      description:
        '특정 게시글의 댓글 목록을 조회합니다. 댓글은 대댓글 트리 구조로 반환됩니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'postUuid',
      description: '게시글 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
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
      description: '댓글 목록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '댓글 목록 조회 성공' },
          total: { type: 'number', example: 5 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          comments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                postUuid: { type: 'string', example: '01HZQ...' },
                userUuid: { type: 'string', example: '01HZQ...' },
                content: { type: 'string', example: '댓글 내용입니다.' },
                parentCommentId: {
                  type: 'number',
                  example: null,
                  nullable: true,
                },
                mentionedUsers: {
                  type: 'array',
                  items: { type: 'string' },
                  example: [],
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-04T12:00:00Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-07-04T12:00:00Z',
                },
                isMyComment: {
                  type: 'boolean',
                  example: true,
                  description: '현재 로그인한 사용자가 작성한 댓글 여부',
                },
                user: {
                  type: 'object',
                  properties: {
                    userUuid: { type: 'string', example: '01HZQ...' },
                    nickname: { type: 'string', example: '홍길동' },
                    profileImage: {
                      type: 'string',
                      example: 'https://example.com/profile.jpg',
                    },
                  },
                },
                children: {
                  type: 'array',
                  items: { type: 'object' }, // children 구조를 간단히 object로 표기
                  example: [],
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('POST_001', '존재하지 않는 인증글입니다.', 404),
    ),
  );
}

export function ApiUpdateComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 수정',
      description: '댓글 내용을 수정합니다. 본인 댓글만 수정할 수 있습니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: 1,
    }),
    ApiBody({
      type: UpdateCommentDto,
    }),
    ApiResponse({
      status: 200,
      description: '댓글 수정 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '댓글이 성공적으로 수정되었습니다.',
          },
          comment: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              postUuid: { type: 'string', example: '01HZQ...' },
              userUuid: { type: 'string', example: '01HZQ...' },
              content: { type: 'string', example: '수정된 댓글 내용입니다.' },
              parentCommentId: {
                type: 'number',
                example: null,
                nullable: true,
              },
              mentionedUsers: {
                type: 'array',
                items: { type: 'string' },
                example: [],
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-07-04T12:00:00Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-07-04T12:10:00Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('COMMENT_001', '존재하지 않는 댓글입니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_003', '댓글 수정 권한이 없습니다.', 403),
    ),
  );
}

export function ApiDeleteComment() {
  return applyDecorators(
    ApiOperation({
      summary: '댓글 삭제',
      description: '댓글을 삭제합니다. 본인 댓글만 삭제할 수 있습니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '댓글 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '댓글이 성공적으로 삭제되었습니다.',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('COMMENT_001', '존재하지 않는 댓글입니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('COMMENT_003', '댓글 삭제 권한이 없습니다.', 403),
    ),
  );
}
