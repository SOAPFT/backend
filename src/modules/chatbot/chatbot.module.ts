import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { Challenge } from '@/entities/challenge.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { ChatRoom } from '@/entities/chat-room.entity';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, Post, User, ChatRoom]),
    ChatModule,
  ],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
