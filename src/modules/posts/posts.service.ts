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

import { LikesService } from '@/modules/likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { ChallengeService } from '../challenges/challenge.service';
import { FindGroupPostsDto } from './dto/find-group-posts.dto';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';

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
}
