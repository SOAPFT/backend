import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@/entities/comment.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
  ) {}

  /*
   * 댓글 생성
   */
  async createComment(createCommentDto: CreateCommentDto, userUuid: string) {
    const { postUuid, content, parentCommentId } = createCommentDto;

    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '댓글을 작성할 인증글을 찾을 수 없습니다.',
      );
    }

    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: parentCommentId },
      });

      if (!parentComment) {
        CustomException.throw(
          ErrorCode.COMMENT_NOT_FOUND,
          '부모 댓글을 찾을 수 없습니다.',
        );
      }
    }

    const newComment = this.commentRepository.create({
      userUuid,
      postUuid,
      content,
      parentCommentId: parentCommentId || null,
      mentionedUsers: [],
    });

    const savedComment = await this.commentRepository.save(newComment);

    return {
      message: '댓글이 성공적으로 생성되었습니다.',
      comment: savedComment,
    };
  }

  /*
   * 게시글의 모든 댓글 조회
   */
  async findAllComments(
    postUuid: string,
    page: number,
    limit: number,
    userUuid: string,
  ) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '댓글을 작성할 인증글을 찾을 수 없습니다.',
      );
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { postUuid },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const userUuids = comments.map((c) => c.userUuid);
    const users = await this.userRepository.find({
      where: { userUuid: In(userUuids) },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    const userMap = new Map(users.map((u) => [u.userUuid, u]));

    const commentsWithUser = comments.map((comment) => ({
      ...comment,
      user: userMap.get(comment.userUuid) || null,
      isMyComment: comment.userUuid === userUuid,
      children: [],
    }));

    const commentMap = new Map<number, any>();
    const rootComments = [];

    commentsWithUser.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    commentsWithUser.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.children.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return {
      message: '댓글 목록 조회 성공',
      total,
      page,
      limit,
      comments: rootComments,
    };
  }

  /*
   * 댓글 수정
   */
  async updateComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userUuid: string,
  ) {
    // 1. 수정할 댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      CustomException.throw(
        ErrorCode.COMMENT_NOT_FOUND,
        '존재하지 않는 댓글입니다.',
      );
    }

    // 2. 본인 댓글인지 권한 검사
    if (comment.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.COMMENT_ACCESS_DENIED,
        '댓글 수정 권한이 없습니다.',
      );
    }

    // 3. 수정 내용 업데이트
    comment.content = updateCommentDto.content;
    comment.updatedAt = new Date();

    const updatedComment = await this.commentRepository.save(comment);

    // 4. 최종 반환
    return {
      message: '댓글이 성공적으로 수정되었습니다.',
      comment: updatedComment,
    };
  }

  /**
   * 댓글 삭제
   */
  async removeComment(commentId: number, userUuid: string) {
    // 1. 삭제할 댓글 존재 여부 확인
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      CustomException.throw(
        ErrorCode.COMMENT_NOT_FOUND,
        '존재하지 않는 댓글입니다.',
      );
    }

    // 2. 본인 댓글인지 권한 검사
    if (comment.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.COMMENT_ACCESS_DENIED,
        '댓글 삭제 권한이 없습니다.',
      );
    }

    // 3. 댓글 삭제
    await this.commentRepository.delete(commentId);

    // 4. 최종 반환
    return {
      message: '댓글이 성공적으로 삭제되었습니다.',
    };
  }
}
