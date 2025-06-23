import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoom } from '@/entities/chat-room.entity';
import { ChatMessage } from '@/entities/chat-message.entity';
import { User } from '@/entities/user.entity';
import { Friendship } from '@/entities/friendship.entity';
import { Challenge } from '@/entities/challenge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      ChatMessage,
      User,
      Friendship,
      Challenge,
    ]),
    JwtModule.register({
      secret: 'tbfpemghkdlxld5837',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
