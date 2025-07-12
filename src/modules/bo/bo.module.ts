import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { Challenge } from '../../entities/challenge.entity';
import { Like } from '../../entities/like.entity';
import { Friendship } from '../../entities/friendship.entity';
import { ChatRoom } from '../../entities/chat-room.entity';
import { ChatMessage } from '../../entities/chat-message.entity';
import { Notification } from '../../entities/notification.entity';
import { BoController } from './bo.controller';
import { BoService } from './bo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Comment,
      Challenge,
      Like,
      Friendship,
      ChatRoom,
      ChatMessage,
      Notification,
    ]),
  ],
  controllers: [BoController],
  providers: [BoService],
})
export class BoModule {}
