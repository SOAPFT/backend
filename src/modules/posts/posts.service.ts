/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Post } from '@/entities/post.entity';

import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { LikesService } from '@/modules/likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { ChallengeService } from '../challenges/challenge.service';
import { FindGroupPostsDto } from './dto/find-group-posts.dto';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ulid } from 'ulid';

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

    // 각 게시글의 userUuid로 사용자 정보 조회 후 병합
    const postsWithUser = await Promise.all(
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
        };
      }),
    );

    return {
      message: '챌린지 게시글 목록 조회 성공',
      total,
      page,
      limit,
      posts: postsWithUser,
    };
  }
}
