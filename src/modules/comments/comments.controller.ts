import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateComment,
  ApiGetAllComments,
  ApiUpdateComment,
  ApiDeleteComment,
} from './decorators/comments.swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';

@ApiTags('comment')
@ApiBearerAuth('JWT-auth')
@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성
   * @param createCommentDto 댓글 생성 정보
   * @param userUuid 인증된 사용자 UUID
   * @returns 생성된 댓글 정보
   */
  @Post()
  @ApiCreateComment()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @UserUuid() userUuid: string,
  ) {
    return await this.commentsService.createComment(createCommentDto, userUuid);
  }

  /**
   * 게시글의 모든 댓글 조회
   * @param postUuid 게시글 ULID
   * @param findAllCommentsDto 댓글 목록 조회 조건들
   * @returns 댓글 목록과 페이지네이션 메타데이터
   */
  @Get('post/:postUuid')
  @ApiGetAllComments()
  async findAllComments(
    @Param('postUuid') postUuid: string,
    @Query() findAllCommentsDto: FindAllCommentsDto,
    @UserUuid() userUuid: string,
  ) {
    return await this.commentsService.findAllComments(
      postUuid,
      findAllCommentsDto.page,
      findAllCommentsDto.limit,
      userUuid,
    );
  }

  /**
   * 댓글 수정
   * @param commentId 댓글 ID
   * @param updateCommentDto 댓글 수정 정보
   * @param userUuid 인증된 사용자 UUID
   * @returns 수정된 댓글 정보
   */
  @Patch(':commentId')
  @ApiUpdateComment()
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserUuid() userUuid: string,
  ) {
    return await this.commentsService.updateComment(
      +commentId,
      updateCommentDto,
      userUuid,
    );
  }

  /**
   * 댓글 삭제
   * @param commentId 댓글 ID
   * @param userUuid 인증된 사용자 UUID
   * @returns 삭제 성공 메시지
   */
  @Delete(':commentId')
  @ApiDeleteComment()
  async removeComment(
    @Param('commentId') commentId: number,
    @UserUuid() userUuid: string,
  ) {
    return await this.commentsService.removeComment(commentId, userUuid);
  }
}
