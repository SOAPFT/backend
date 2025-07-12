import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { LikesModule } from '@/modules/likes/likes.module';
import { CommentsModule } from '../comments/comments.module';
import { ChallengeModule } from '../challenges/challenge.module';
import { User } from '@/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Comment } from '@/entities/comment.entity';
import { Suspicion } from '@/entities/suspicion.entity';
import { Like } from '@/entities/like.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, Suspicion, Like]),
    forwardRef(() => LikesModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => ChallengeModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
