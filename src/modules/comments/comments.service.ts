import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from '@/modules/posts/posts.service';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { Comment } from '@/entities/comment.entity';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UsersService,
  ) {}
}
