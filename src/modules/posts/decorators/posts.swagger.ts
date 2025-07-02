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
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostDto } from '../dto/create-post.dto';

export function ApiCreatePost() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 게시글 생성',
      description: '게시글 생성 정보를 받아 새로운 게시글을 생성합니다.',
    }),
    ApiBody({
      type: CreatePostDto,
    }),
    ApiResponse({
      status: 201,
      description: '게시글 생성 성공',
      schema: {
        example: {
          message: '게시물이 생성되었습니다.',
          post: {
            id: 1,
            postUuid: '01JZ13GQ31DJAY0GVF5F69HEH1',
            title: '제목 예시',
            userUuid: '01JZ13GQ31DJAY0GVF5F69HEH1',
            challengeUuid: '01JZ13GQ31DJAY0GVF5F69HEH2',
            content: '내용 예시',
            imageUrl: ['https://example.com/image1.jpg'],
            isPublic: true,
            createdAt: '2025-07-02T09:00:00.000Z',
            updatedAt: '2025-07-02T09:00:00.000Z',
          },
        },
      },
    }),
  );
}

export function ApiUpdatePost() {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 수정',
      description: '게시글을 수정합니다. 작성자 본인만 수정할 수 있습니다.',
    }),
    ApiParam({
      name: 'postUuid',
      type: String,
      description: '수정할 게시글 UUID',
      example: '01JZ13GQ31DJAY0GVF5F69HEH2',
    }),
    ApiBody({
      type: UpdatePostDto,
      description: '수정할 게시글 정보',
      examples: {
        default: {
          summary: '게시글 수정 예시',
          value: {
            title: '오늘의 인증글 제목 수정',
            content: '오늘은 이렇게 운동했습니다. 수정본!',
            imageUrl: ['https://example.com/image1.jpg'],
            isPublic: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: '게시글 수정 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '게시글이 수정되었습니다.' },
          post: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              postUuid: {
                type: 'string',
                example: '01JZ13GQ31DJAY0GVF5F69HEH2',
              },
              title: { type: 'string', example: '오늘의 인증글 제목 수정' },
              content: {
                type: 'string',
                example: '오늘은 이렇게 운동했습니다. 수정본!',
              },
              imageUrl: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'https://example.com/image1.jpg',
                },
              },
              isPublic: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'POST_001: 해당 게시글이 없습니다.',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'POST_001' },
          message: { type: 'string', example: '해당 게시글이 없습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
          details: {
            type: 'object',
            properties: {
              postUuid: {
                type: 'string',
                example: '01JZ13GQ31DJAY0GVF5F69HEH2',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'POST_002: 해당 포스트에 접근할 수 없습니다.',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'POST_002' },
          message: {
            type: 'string',
            example: '해당 포스트에 접근할 수 없습니다.',
          },
          timestamp: { type: 'string', format: 'date-time' },
          details: {},
        },
      },
    }),
  );
}

export function ApiGetMyPosts() {
  return applyDecorators(
    ApiOperation({
      summary: '사용자 게시글 조회 (페이지네이션)',
      description:
        '현재 로그인한 사용자의 게시글 목록을 페이지네이션으로 조회합니다.',
    }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiResponse({
      status: 200,
      description: '조회 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '사용자 게시글 조회 성공' },
          total: { type: 'number', example: 25 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          posts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                postUuid: {
                  type: 'string',
                  example: '01JZ13GQ31DJAY0GVF5F69HEH2',
                },
                title: { type: 'string', example: '오늘의 인증글 제목' },
                content: { type: 'string', example: '인증글 내용' },
                imageUrl: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'https://example.com/image.jpg',
                  },
                },
                isPublic: { type: 'boolean', example: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    }),
  );
}

// 게시글 상세 조회
export function ApiGetPostDetail() {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 상세 조회',
      description: '게시글의 상세 내용을 조회합니다.',
    }),
    ApiParam({
      name: 'postUuid',
      description: '조회할 게시글 ULID',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: '게시글 상세 조회 성공',
      schema: {
        example: {
          message: '게시글 상세 조회 성공',
          post: {
            id: 2,
            postUuid: '01JZ5ZE1BANYQXND8XX8DESPXM',
            title: '오늘의 인증글 제목',
            challengeUuid: '01JZ13GQ31DJAY0GVF5F69HEH2',
            content: '오늘 헬스장에서 3시간 운동했어요! 💪',
            imageUrl: [
              'https://soapft-bucket.s3.amazonaws.com/images/workout2.jpg',
            ],
            isPublic: true,
            createdAt: '2025-07-02T16:27:33.105Z',
            updatedAt: '2025-07-02T16:40:59.340Z',
            userUuid: '01JYKVN18MCW5B9FZ1PP7T14XS',
            user: {
              userUuid: '01JYKVN18MCW5B9FZ1PP7T14XS',
              nickname: '헬스왕',
              profileImage: 'https://example.com/profile.jpg',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'POST_001: 해당 게시글이 없습니다.',
      schema: {
        type: 'object',
        properties: {
          errorCode: { type: 'string', example: 'POST_001' },
          message: { type: 'string', example: '해당 게시글이 없습니다.' },
          timestamp: { type: 'string', format: 'date-time' },
          details: {
            type: 'object',
            properties: {
              postUuid: {
                type: 'string',
                example: '01JZ13GQ31DJAY0GVF5F69HEH2',
              },
            },
          },
        },
      },
    }),
  );
}

export function ApiDeletePost() {
  return applyDecorators(
    ApiOperation({
      summary: '인증글 삭제',
      description: '작성한 인증글을 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'postUuid',
      description: '인증글 UUID',
      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    }),
    ApiResponse({
      status: 200,
      description: '인증글 삭제 성공',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '인증글이 삭제되었습니다.',
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
      description: '인증글을 찾을 수 없음',
    }),
  );
}

export function ApiGetPopularPosts() {
  return applyDecorators(
    ApiOperation({
      summary: '인기 인증글 조회',
      description: '좋아요가 많은 인기 인증글을 조회합니다.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '조회할 인증글 수 (기본값: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'period',
      required: false,
      description: '기간 (daily, weekly, monthly)',
      example: 'weekly',
    }),
    ApiResponse({
      status: 200,
      description: '인기 인증글 조회 성공',
      schema: {
        type: 'object',
        properties: {
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
                likeCount: { type: 'number', example: 150 },
                commentCount: { type: 'number', example: 23 },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
              },
            },
          },
        },
      },
    }),
  );
}

/**
 * 닉네임으로 사용자 게시글 조회 API
 */
export function ApiGetUserPosts() {
  return applyDecorators(
    ApiOperation({ summary: '특정 사용자 게시글 목록 조회' }),
    ApiParam({ name: 'userUuid', description: '사용자 UUID', type: String }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '페이지 번호',
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: '페이지당 개수',
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: '사용자 게시글 목록 조회 성공',
      schema: {
        example: {
          message: '사용자 게시글 목록 조회 성공',
          total: 12,
          page: 1,
          limit: 10,
          posts: [
            {
              id: 1,
              postUuid: '01JZ....',
              title: '인증글 제목',
              content: '오늘은 이렇게 운동했습니다.',
              imageUrl: ['https://example.com/image.jpg'],
              isPublic: true,
              createdAt: '2025-07-02T12:34:56Z',
              updatedAt: '2025-07-02T12:34:56Z',
            },
          ],
        },
      },
    }),
  );
}

/**
 * 그룹 게시글 조회 API
 */
export function ApiGetGroupPosts() {
  return applyDecorators(
    ApiOperation({
      summary: '그룹 게시글 조회',
      description:
        '특정 그룹(챌린지)에 속한 모든 참여자들의 게시글을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'groupId',
      description: '조회할 그룹(챌린지) ID',
      type: 'string',
      example: '01HXX2X2X2X2X2X2X2X2X2X2X2',
    }),
    ApiQuery({
      name: 'page',
      description: '페이지 번호 (1부터 시작)',
      type: 'number',
      example: 1,
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: '페이지당 게시글 수',
      type: 'number',
      example: 10,
      required: false,
    }),
    ApiQuery({
      name: 'sortBy',
      description: '정렬 기준',
      enum: ['latest', 'oldest', 'likes'],
      example: 'latest',
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: '그룹 게시글 조회 성공',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: '성공 여부',
          },
          data: {
            type: 'object',
            properties: {
              posts: {
                type: 'array',
                description: '게시글 목록',
                items: {
                  type: 'object',
                  properties: {
                    postUuid: {
                      type: 'string',
                      example: '01HXX1X1X1X1X1X1X1X1X1X1X1',
                      description: '게시글 ULID',
                    },
                    content: {
                      type: 'string',
                      example: '오늘 운동 완료했습니다!',
                      description: '게시글 내용',
                    },
                    imageUrl: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['https://example.com/image.jpg'],
                      description: '이미지 URL 배열',
                    },
                    likeCount: {
                      type: 'number',
                      example: 5,
                      description: '좋아요 수',
                    },
                    commentCount: {
                      type: 'number',
                      example: 3,
                      description: '댓글 수',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-06-22T12:00:00.000Z',
                      description: '생성 시각',
                    },
                    author: {
                      type: 'object',
                      properties: {
                        userUuid: {
                          type: 'string',
                          example: '01HXX3X3X3X3X3X3X3X3X3X3X3',
                          description: '작성자 UUID',
                        },
                        nickname: {
                          type: 'string',
                          example: 'user123',
                          description: '작성자 닉네임',
                        },
                        profileImage: {
                          type: 'string',
                          example: 'https://example.com/profile.jpg',
                          description: '작성자 프로필 이미지',
                        },
                      },
                    },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  currentPage: {
                    type: 'number',
                    example: 1,
                    description: '현재 페이지',
                  },
                  totalPages: {
                    type: 'number',
                    example: 5,
                    description: '전체 페이지 수',
                  },
                  totalItems: {
                    type: 'number',
                    example: 50,
                    description: '전체 게시글 수',
                  },
                  itemsPerPage: {
                    type: 'number',
                    example: 10,
                    description: '페이지당 게시글 수',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('CHALLENGE_003', '존재하지 않는 챌린지입니다.', 404),
    ),
    ApiResponse(
      createErrorResponse(
        'CHALLENGE_009',
        '챌린지에 참여하지 않은 사용자입니다.',
        403,
      ),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}
