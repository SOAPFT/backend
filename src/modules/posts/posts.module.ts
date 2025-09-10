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
import { ImageVerification } from '@/entities/image-verification.entity';
import { AiModule } from '../ai/ai.module';
import { Challenge } from '@/entities/challenge.entity';
import { UploadsModule } from '../uploads/uploads.module';
import { S3Module } from '../s3/s3.module';
import { JwtModule } from '@nestjs/jwt';
import { SqsModule } from '../sqs/sqs.module';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      Comment,
      Suspicion,
      Like,
      ImageVerification,
      Challenge,
    ]),
    forwardRef(() => LikesModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => ChallengeModule),
    forwardRef(() => UsersModule),
    AiModule,
    UploadsModule,
    S3Module,
    SqsModule,
    ChatbotModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
