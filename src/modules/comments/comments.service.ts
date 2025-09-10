import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@/entities/comment.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
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
    private notificationsService: NotificationsService,
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

    // 댓글 알림 및 멘션 알림 발송
    try {
      const commenter = await this.userRepository.findOne({
        where: { userUuid },
        select: ['nickname'],
      });

      if (commenter) {
        // 1. 게시글 작성자에게 댓글 알림 (자신의 게시글이 아닌 경우)
        if (post.userUuid !== userUuid) {
          await this.notificationsService.createPostCommentNotification(
            post.userUuid,
            userUuid,
            commenter.nickname,
            postUuid,
            content.length > 50 ? content.substring(0, 50) + '...' : content,
          );
        }

        // 2. 멘션된 사용자들에게 멘션 알림
        const mentionedUsernames = this.extractMentions(content);
        if (mentionedUsernames.length > 0) {
          // 닉네임으로 사용자 조회
          const mentionedUsers = await this.userRepository.find({
            where: mentionedUsernames.map(nickname => ({ nickname })),
            select: ['userUuid', 'nickname'],
          });

          // 각 멘션된 사용자에게 알림 발송 (자신은 제외)
          for (const mentionedUser of mentionedUsers) {
            if (mentionedUser.userUuid !== userUuid) {
              await this.notificationsService.createMentionNotification(
                mentionedUser.userUuid,
                userUuid,
                commenter.nickname,
                postUuid,
                content.length > 50 ? content.substring(0, 50) + '...' : content,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('댓글 알림 발송 실패:', error);
    }

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

  /**
   * 텍스트에서 @닉네임 멘션을 추출하는 메서드
   */
  private extractMentions(content: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9가-힣_]+)/g;
    const matches = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      matches.push(match[1]); // @를 제외한 닉네임만 추출
    }

    // 중복 제거
    return [...new Set(matches)];
  }
}
