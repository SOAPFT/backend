import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';
import { DeleteResponseDto } from '../dto/delete-response.dto';

// 사용자 수정 데코레이터
export const ApiUpdateUser = () =>
  applyDecorators(
    ApiOperation({
      summary: '사용자 정보 수정',
      description: '관리자가 사용자 정보를 수정합니다.',
    }),
    ApiParam({
      name: 'userUuid',
      description: '사용자 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateUserDto,
      description: '수정할 사용자 정보',
    }),
    ApiResponse({
      status: 200,
      description: '사용자 정보가 성공적으로 수정되었습니다.',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '사용자 정보가 수정되었습니다.' },
          user: {
            type: 'object',
            description: '수정된 사용자 정보',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없습니다.',
    }),
  );

// 사용자 삭제 데코레이터
export const ApiDeleteUser = () =>
  applyDecorators(
    ApiOperation({
      summary: '사용자 삭제',
      description: '관리자가 사용자를 삭제합니다.',
    }),
    ApiParam({
      name: 'userUuid',
      description: '사용자 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: '사용자가 성공적으로 삭제되었습니다.',
      type: DeleteResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없습니다.',
    }),
  );

// 게시글 수정 데코레이터
export const ApiUpdatePost = () =>
  applyDecorators(
    ApiOperation({
      summary: '게시글 수정',
      description: '관리자가 게시글을 수정합니다.',
    }),
    ApiParam({
      name: 'postUuid',
      description: '게시글 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdatePostDto,
      description: '수정할 게시글 정보',
    }),
    ApiResponse({
      status: 200,
      description: '게시글이 성공적으로 수정되었습니다.',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '게시글이 수정되었습니다.' },
          post: {
            type: 'object',
            description: '수정된 게시글 정보',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '게시글을 찾을 수 없습니다.',
    }),
  );

// 게시글 삭제 데코레이터
export const ApiDeletePost = () =>
  applyDecorators(
    ApiOperation({
      summary: '게시글 삭제',
      description: '관리자가 게시글을 삭제합니다.',
    }),
    ApiParam({
      name: 'postUuid',
      description: '게시글 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: '게시글이 성공적으로 삭제되었습니다.',
      type: DeleteResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: '게시글을 찾을 수 없습니다.',
    }),
  );

// 댓글 수정 데코레이터
export const ApiUpdateComment = () =>
  applyDecorators(
    ApiOperation({
      summary: '댓글 수정',
      description: '관리자가 댓글을 수정합니다.',
    }),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: '1',
    }),
    ApiBody({
      type: UpdateCommentDto,
      description: '수정할 댓글 정보',
    }),
    ApiResponse({
      status: 200,
      description: '댓글이 성공적으로 수정되었습니다.',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '댓글이 수정되었습니다.' },
          comment: {
            type: 'object',
            description: '수정된 댓글 정보',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '댓글을 찾을 수 없습니다.',
    }),
  );

// 댓글 삭제 데코레이터
export const ApiDeleteComment = () =>
  applyDecorators(
    ApiOperation({
      summary: '댓글 삭제',
      description: '관리자가 댓글을 삭제합니다.',
    }),
    ApiParam({
      name: 'commentId',
      description: '댓글 ID',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: '댓글이 성공적으로 삭제되었습니다.',
      type: DeleteResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: '댓글을 찾을 수 없습니다.',
    }),
  );

// 챌린지 수정 데코레이터
export const ApiUpdateChallenge = () =>
  applyDecorators(
    ApiOperation({
      summary: '챌린지 수정',
      description: '관리자가 챌린지를 수정합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateChallengeDto,
      description: '수정할 챌린지 정보',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지가 성공적으로 수정되었습니다.',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: '챌린지가 수정되었습니다.' },
          challenge: {
            type: 'object',
            description: '수정된 챌린지 정보',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없습니다.',
    }),
  );

// 챌린지 삭제 데코레이터
export const ApiDeleteChallenge = () =>
  applyDecorators(
    ApiOperation({
      summary: '챌린지 삭제',
      description: '관리자가 챌린지를 삭제합니다.',
    }),
    ApiParam({
      name: 'challengeUuid',
      description: '챌린지 UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: '챌린지가 성공적으로 삭제되었습니다.',
      type: DeleteResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: '챌린지를 찾을 수 없습니다.',
    }),
  );
