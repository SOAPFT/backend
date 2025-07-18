import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { GetChatRoomsDto } from './dto/get-chat-rooms.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import {
  ApiCreateChatRoom,
  ApiGetChatRooms,
  ApiGetChatRoom,
  ApiSendMessage,
  ApiGetMessages,
  ApiMarkMessagesAsRead,
  ApiLeaveChatRoom,
  ApiFindOrCreateDirectRoom,
} from './decorators/chat.swagger';

@ApiTags('chat')
@ApiBearerAuth('JWT-auth')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 1대1 채팅방 찾기 또는 생성
   */
  @Post('direct/:targetUserUuid')
  @ApiFindOrCreateDirectRoom()
  async findOrCreateDirectRoom(
    @Param('targetUserUuid') targetUserUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.findOrCreateDirectRoom(userUuid, targetUserUuid);
  }

  /**
   * 채팅방 생성
   */
  @Post('room')
  @ApiCreateChatRoom()
  async createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.createChatRoom(userUuid, createChatRoomDto);
  }

  /**
   * 채팅방 목록 조회
   */
  @Get('rooms')
  @ApiGetChatRooms()
  async getChatRooms(
    @Query() getChatRoomsDto: GetChatRoomsDto,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.getChatRooms(userUuid, getChatRoomsDto);
  }

  /**
   * 특정 채팅방 조회
   */
  @Get('room/:roomUuid')
  @ApiGetChatRoom()
  async getChatRoom(
    @Param('roomUuid') roomUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.getChatRoom(userUuid, roomUuid);
  }

  /**
   * 메시지 전송
   */
  @Post('room/:roomUuid/message')
  @ApiSendMessage()
  async sendMessage(
    @Param('roomUuid') roomUuid: string,
    @Body() sendMessageDto: SendMessageDto,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.sendMessage(userUuid, roomUuid, sendMessageDto);
  }

  /**
   * 채팅방 메시지 목록 조회
   */
  @Get('room/:roomUuid/messages')
  @ApiGetMessages()
  async getMessages(
    @Param('roomUuid') roomUuid: string,
    @Query() getMessagesDto: GetMessagesDto,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.getMessages(userUuid, roomUuid, getMessagesDto);
  }

  /**
   * 메시지 읽음 처리
   */
  @Patch('room/:roomUuid/read')
  @ApiMarkMessagesAsRead()
  async markMessagesAsRead(
    @Param('roomUuid') roomUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.markMessagesAsRead(userUuid, roomUuid);
  }

  /**
   * 채팅방 나가기
   */
  @Delete('room/:roomUuid/leave')
  @ApiLeaveChatRoom()
  async leaveChatRoom(
    @Param('roomUuid') roomUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.chatService.leaveChatRoom(userUuid, roomUuid);
  }
}
