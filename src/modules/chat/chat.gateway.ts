import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userUuid?: string;
  nickname?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // iOS 앱에서 접근할 수 있도록 설정
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userUuid

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  /**
   * 클라이언트 연결 시
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.info('WebSocket 연결 시도', {
        socketId: client.id,
        auth: client.handshake.auth,
        headers: client.handshake.headers,
      });

      // JWT 토큰 검증
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      this.logger.info('토큰 추출 결과', {
        socketId: client.id,
        hasToken: !!token,
        tokenLength: token?.length || 0,
      });

      if (!token) {
        this.logger.warn('WebSocket 연결 실패: 토큰 없음', {
          socketId: client.id,
        });
        client.emit('error', { message: '인증 토큰이 필요합니다.' });
        client.disconnect();
        return;
      }

      this.logger.info('JWT 토큰 검증 시작', {
        socketId: client.id,
        tokenPreview: token.substring(0, 20) + '...',
      });

      const payload = this.jwtService.verify(token);

      this.logger.info('JWT 토큰 검증 성공', {
        socketId: client.id,
        userUuid: payload.userUuid,
        nickname: payload.nickname,
      });

      client.userUuid = payload.userUuid;
      client.nickname = payload.nickname;

      this.connectedUsers.set(client.id, client.userUuid);

      // 사용자의 채팅방들에 join
      await this.joinUserChatRooms(client);

      this.logger.info('WebSocket 연결 성공', {
        socketId: client.id,
        userUuid: client.userUuid,
        nickname: client.nickname,
      });

      // 연결 성공 알림
      client.emit('connected', {
        message: '채팅 서버에 연결되었습니다.',
        userUuid: client.userUuid,
      });
    } catch (error) {
      this.logger.error('WebSocket 인증 실패', {
        socketId: client.id,
        error: error.message,
      });
      client.disconnect();
    }
  }

  /**
   * 클라이언트 연결 해제 시
   */
  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedUsers.delete(client.id);

    this.logger.info('WebSocket 연결 해제', {
      socketId: client.id,
      userUuid: client.userUuid,
    });
  }

  /**
   * 메시지 전송
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { roomUuid: string; message: SendMessageDto },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { roomUuid, message } = data;

      if (!client.userUuid) {
        client.emit('error', { message: '인증되지 않은 사용자입니다.' });
        return;
      }

      // 메시지 저장
      const savedMessage = await this.chatService.sendMessage(
        client.userUuid,
        roomUuid,
        message,
      );

      // 나를 제외한 채팅방의 다른 참여자들에게만 메시지 전송
      client.to(roomUuid).emit('newMessage', savedMessage);

      this.logger.info('WebSocket 메시지 전송', {
        messageId: savedMessage.id,
        roomUuid,
        senderUuid: client.userUuid,
      });
    } catch (error) {
      this.logger.error('WebSocket 메시지 전송 실패', {
        error: error.message,
        userUuid: client.userUuid,
      });

      client.emit('error', {
        message: '메시지 전송에 실패했습니다.',
        error: error.message,
      });
    }
  }

  /**
   * 채팅방 입장
   */
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomUuid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { roomUuid } = data;

      if (!client.userUuid) {
        client.emit('error', { message: '인증되지 않은 사용자입니다.' });
        return;
      }

      // 채팅방 접근 권한 확인
      await this.chatService.getChatRoom(client.userUuid, roomUuid);

      // 소켓을 채팅방에 join
      await client.join(roomUuid);

      client.emit('joinedRoom', { roomUuid });

      this.logger.info('WebSocket 채팅방 입장', {
        roomUuid,
        userUuid: client.userUuid,
        socketId: client.id,
      });
    } catch (error) {
      this.logger.error('WebSocket 채팅방 입장 실패', {
        error: error.message,
        userUuid: client.userUuid,
      });

      client.emit('error', {
        message: '채팅방 입장에 실패했습니다.',
        error: error.message,
      });
    }
  }

  /**
   * 채팅방 나가기
   */
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomUuid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { roomUuid } = data;

      await client.leave(roomUuid);
      client.emit('leftRoom', { roomUuid });

      this.logger.info('WebSocket 채팅방 나가기', {
        roomUuid,
        userUuid: client.userUuid,
        socketId: client.id,
      });
    } catch (error) {
      this.logger.error('WebSocket 채팅방 나가기 실패', {
        error: error.message,
        userUuid: client.userUuid,
      });
    }
  }

  /**
   * 메시지 읽음 처리
   */
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { roomUuid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { roomUuid } = data;

      if (!client.userUuid) {
        client.emit('error', { message: '인증되지 않은 사용자입니다.' });
        return;
      }

      await this.chatService.markMessagesAsRead(client.userUuid, roomUuid);

      // 채팅방의 다른 참여자들에게 읽음 상태 알림
      client.to(roomUuid).emit('messagesRead', {
        roomUuid,
        userUuid: client.userUuid,
        timestamp: new Date(),
      });

      this.logger.info('WebSocket 메시지 읽음 처리', {
        roomUuid,
        userUuid: client.userUuid,
      });
    } catch (error) {
      this.logger.error('WebSocket 메시지 읽음 처리 실패', {
        error: error.message,
        userUuid: client.userUuid,
      });

      client.emit('error', {
        message: '메시지 읽음 처리에 실패했습니다.',
        error: error.message,
      });
    }
  }

  /**
   * 타이핑 상태 알림
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { roomUuid: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { roomUuid, isTyping } = data;

    if (!client.userUuid) {
      return;
    }

    // 채팅방의 다른 참여자들에게 타이핑 상태 알림
    client.to(roomUuid).emit('userTyping', {
      roomUuid,
      userUuid: client.userUuid,
      nickname: client.nickname,
      isTyping,
    });
  }

  /**
   * 사용자의 모든 채팅방에 join
   */
  private async joinUserChatRooms(client: AuthenticatedSocket) {
    try {
      const chatRoomsResponse = await this.chatService.getChatRooms(
        client.userUuid,
        { page: 1, limit: 100 }, // 최대 100개 채팅방
      );

      for (const chatRoom of chatRoomsResponse.chatRooms) {
        await client.join(chatRoom.roomUuid);
      }

      this.logger.info('사용자 채팅방 join 완료', {
        userUuid: client.userUuid,
        roomCount: chatRoomsResponse.chatRooms.length,
      });
    } catch (error) {
      this.logger.error('사용자 채팅방 join 실패', {
        userUuid: client.userUuid,
        error: error.message,
      });
    }
  }

  /**
   * 특정 사용자에게 알림 전송 (외부에서 호출)
   */
  async sendNotificationToUser(userUuid: string, notification: any) {
    const userSockets = Array.from(this.connectedUsers.entries())
      .filter(([, uuid]) => uuid === userUuid)
      .map(([socketId]) => socketId);

    for (const socketId of userSockets) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  /**
   * 채팅방에 시스템 메시지 전송
   */
  async sendSystemMessage(roomUuid: string, message: string) {
    this.server.to(roomUuid).emit('systemMessage', {
      roomUuid,
      message,
      timestamp: new Date(),
    });
  }
}
