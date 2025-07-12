/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Post } from '@/entities/post.entity';

import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { LikesService } from '@/modules/likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { ChallengeService } from '../challenges/challenge.service';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ulid } from 'ulid';
import { Comment } from '@/entities/comment.entity';
import { Suspicion } from '@/entities/suspicion.entity';
import { Like } from '@/entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    private likesService: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @Inject(forwardRef(() => ChallengeService))
    private challengeService: ChallengeService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Suspicion)
    private suspicionRepository: Repository<Suspicion>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private userService: UsersService,
  ) {}

  // 게시물 생성
  async createPost(dto: CreatePostDto, userUuid: string) {
    const newPost = this.postRepository.create({
      postUuid: ulid(),
      title: dto.title,
      userUuid,
      challengeUuid: dto.challengeUuid,
      content: dto.content,
      imageUrl: dto.imageUrl,
      isPublic: dto.isPublic ?? true,
    });

    await this.postRepository.save(newPost);
    return {
      message: '게시물이 생성되었습니다.',
      post: newPost,
    };
  }

  // 게시물 수정
  async updatePost(postUuid: string, dto: UpdatePostDto, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글이 없습니다.',
      );
    }

    if (post.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.POST_ACCESS_DENIED,
        '해당 포스트에 접근할 수 없습니다.',
      );
    }

    if (dto.title !== undefined) post.title = dto.title;
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.imageUrl !== undefined) post.imageUrl = dto.imageUrl;
    if (dto.isPublic !== undefined) post.isPublic = dto.isPublic;

    await this.postRepository.save(post);

    return {
      message: '게시글이 수정되었습니다.',
      post,
    };
  }

  // 자신의 게시글 조회
  async getPostsByUserUuid(userUuid: string, page = 1, limit = 10) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { userUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: '사용자 게시글 조회 성공',
      total,
      page,
      limit,
      posts,
    };
  }

  // 특정 사용자 게시글 목록 조회
  async getUserPosts(userUuid: string, page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { userUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: '사용자 게시글 목록 조회 성공',
      total,
      page,
      limit,
      posts,
    };
  }

  // 게시글 상세 조회
  async getPostDetail(postUuid: string, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글을 찾을 수 없습니다.',
      );
    }

    post.views += 1;
    await this.postRepository.save(post);

    // 사용자 정보 조회
    const user = await this.userRepository.findOne({
      where: { userUuid: post.userUuid },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    // 좋아요 수
    const likeCount = await this.likeRepository.count({
      where: { postUuid },
    });

    // 내가 좋아요 했는지 여부
    const liked = await this.likeRepository.findOne({
      where: { postUuid, userUuid },
    });

    // 의심 수
    const suspicionCount = await this.suspicionRepository.count({
      where: { postUuid },
    });
    // 내가 의심했는지 여부
    const suspicious = await this.suspicionRepository.findOne({
      where: { postUuid, userUuid },
    });

    return {
      message: '게시글 상세 조회 성공',
      post: {
        id: post.id,
        postUuid: post.postUuid,
        title: post.title,
        challengeUuid: post.challengeUuid,
        content: post.content,
        imageUrl: post.imageUrl,
        isPublic: post.isPublic,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        userUuid: post.userUuid,
        isMine: post.userUuid === userUuid,
        views: post.views,
        user: user
          ? {
              userUuid: user.userUuid,
              nickname: user.nickname,
              profileImage: user.profileImage,
            }
          : null,
        likeCount,
        isLiked: !!liked,
        suspicionCount,
        isSuspicious: !!suspicious,
      },
    };
  }

  // 게시글 삭제
  async deletePost(postUuid: string, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글을 찾을 수 없습니다.',
      );
    }

    if (post.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.POST_ACCESS_DENIED,
        '해당 게시글을 삭제할 권한이 없습니다.',
      );
    }

    await this.postRepository.remove(post);

    return {
      message: '게시글이 삭제되었습니다.',
    };
  }

  // 그룹 게시글 조회
  async getPostsByChallenge(
    challengeUuid: string,
    page: number,
    limit: number,
  ) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { challengeUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const postUuids = posts.map((post) => post.postUuid);

    if (postUuids.length === 0) {
      return {
        message: '챌린지 게시글 목록 조회 성공',
        total,
        page,
        limit,
        posts: [],
      };
    }

    const likeCounts =
      await this.likesService.getLikeCountsByPostIds(postUuids);

    const commentCountsArray = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment.postUuid', 'postUuid')
      .addSelect('COUNT(comment.id)', 'count')
      .where('comment.postUuid IN (:...postUuids)', { postUuids })
      .groupBy('comment.postUuid')
      .getRawMany();

    const commentCounts = new Map<string, number>();
    commentCountsArray.forEach((c) =>
      commentCounts.set(c.postUuid, parseInt(c.count)),
    );

    // 각 게시글의 userUuid로 사용자 정보 조회 후 병합
    const postsWithUserAndLike = await Promise.all(
      posts.map(async (post) => {
        const user = await this.userRepository.findOne({
          where: { userUuid: post.userUuid },
          select: ['userUuid', 'nickname', 'profileImage'],
        });

        return {
          ...post,
          user: user
            ? {
                userUuid: user.userUuid,
                nickname: user.nickname,
                profileImage: user.profileImage,
              }
            : null,
          likeCount: likeCounts.get(post.postUuid) || 0,
          commentCount: commentCounts.get(post.postUuid) || 0,
        };
      }),
    );

    return {
      message: '챌린지 게시글 목록 조회 성공',
      total,
      page,
      limit,
      posts: postsWithUserAndLike,
    };
  }

  async getUserCalendar(userUuid: string, year: number, month: number) {
    const posts = await this.postRepository.find({
      where: {
        userUuid,
        createdAt: Between(
          new Date(`${year}-${month}-01`),
          new Date(`${year}-${month}-31`),
        ),
      },
      select: ['postUuid', 'imageUrl', 'createdAt'],
    });

    // 날짜별 그룹핑
    const grouped = posts.reduce((acc, post) => {
      const date = post.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        postUuid: post.postUuid,
        imageUrl: post.imageUrl,
      });
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, posts]) => ({
      date,
      posts,
    }));
  }

  async reportSuspiciousPost(userUuid: string, postUuid: string) {
    const existing = await this.suspicionRepository.findOne({
      where: { userUuid, postUuid },
    });

    if (existing) {
      CustomException.throw(
        ErrorCode.ALREADY_REPORTED,
        '이미 의심한 게시글입니다.',
      );
    }

    const report = this.suspicionRepository.create({ userUuid, postUuid });
    await this.suspicionRepository.save(report);

    return { message: '의심하기 완료' };
  }
}
