import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '@/modules/posts/posts.module';
import { Comment } from '@/entities/comment.entity';
import { User } from '@/entities/user.entity';
import { Post } from '@/entities/post.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]),
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
