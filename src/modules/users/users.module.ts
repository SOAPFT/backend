import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModule } from '../likes/likes.module';
import { Auth } from '@/entities/auth.entity';
import { Post } from '@/entities/post.entity';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '@/auth/auth.module';
import { Friendship } from '@/entities/friendship.entity';
import { FriendshipModule } from '@/modules/friendship/friendship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Post, Friendship]),
    forwardRef(() => LikesModule),
    forwardRef(() => PostsModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FriendshipModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
