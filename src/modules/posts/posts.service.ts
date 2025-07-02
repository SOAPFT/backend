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
import { FindAllPostsDto } from './dto/find-all-posts.dto';
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
}
