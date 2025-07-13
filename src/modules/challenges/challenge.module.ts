import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { Challenge } from '@/entities/challenge.entity';
import { User } from '@/entities/user.entity';
import { Post } from '@/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { ChatModule } from '../chat/chat.module';
import { forwardRef } from '@nestjs/common';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, User, Post]),
    forwardRef(() => UsersModule),
    forwardRef(() => PostsModule),
    forwardRef(() => ChatModule),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
