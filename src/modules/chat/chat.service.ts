import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Logger } from 'winston';
import { ulid } from 'ulid';
import { ChatRoom } from '@/entities/chat-room.entity';
import { ChatMessage } from '@/entities/chat-message.entity';
import { User } from '@/entities/user.entity';
import { Friendship } from '@/entities/friendship.entity';
import { Challenge } from '@/entities/challenge.entity';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { GetChatRoomsDto } from './dto/get-chat-rooms.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { ChatRoomType, MessageType } from '@/types/chat.enum';
import { FriendshipStatus } from '@/types/friendship.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @Inject('winston')
    private readonly logger: Logger,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 1대1 채팅방 찾기 또는 생성
   */
  async findOrCreateDirectRoom(userUuid: string, targetUserUuid: string) {
    // 자기 자신과의 채팅방 생성 방지
    if (userUuid === targetUserUuid) {
      throw new BadRequestException('자기 자신과는 채팅할 수 없습니다.');
    }

    // 대상 사용자 존재 확인
    const targetUser = await this.userRepository.findOne({
      where: { userUuid: targetUserUuid },
    });

    if (!targetUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    // 친구 관계 확인
    const friendship = await this.friendshipRepository.findOne({
      where: [
        {
          requesterUuid: userUuid,
          addresseeUuid: targetUserUuid,
          status: FriendshipStatus.ACCEPTED,
        },
        {
          requesterUuid: targetUserUuid,
          addresseeUuid: userUuid,
          status: FriendshipStatus.ACCEPTED,
        },
      ],
    });

    if (!friendship) {
      throw new ForbiddenException(
        '친구가 아닌 사용자와는 채팅할 수 없습니다.',
      );
    }

    const participants = [userUuid, targetUserUuid].sort();

    // 기존 1대1 채팅방 확인
    const existingRoom = await this.chatRoomRepository
      .createQueryBuilder('room')
      .where('room.type = :type', { type: ChatRoomType.DIRECT })
      .andWhere('room.participantUuids = :participantUuids', {
        participantUuids: participants,
      })
      .andWhere('room.isActive = :isActive', { isActive: true })
      .getOne();

    if (existingRoom) {
      // 기존 채팅방 반환
      const roomResponse = await this.formatChatRoomResponse(
        existingRoom,
        userUuid,
      );
      return {
        ...roomResponse,
        isNewRoom: false,
      };
    }

    // 새 채팅방 생성
    const roomUuid = ulid();
    const roomName = await this.generateRoomName(participants, userUuid);

    const chatRoom = this.chatRoomRepository.create({
      roomUuid,
      type: ChatRoomType.DIRECT,
      name: roomName,
      participantUuids: participants,
      challengeUuid: null,
      isActive: true,
    });

    const savedRoom = await this.chatRoomRepository.save(chatRoom);
    this.logger.info('1대1 채팅방 생성 완료', {
      roomUuid,
      userUuid,
      targetUserUuid,
    });

    const roomResponse = await this.formatChatRoomResponse(savedRoom, userUuid);
    return {
      ...roomResponse,
      isNewRoom: true,
    };
  }

  /**
   * 채팅방 생성
   */
  async createChatRoom(userUuid: string, createChatRoomDto: CreateChatRoomDto) {
    const { type, participantUuids, name, challengeUuid } = createChatRoomDto;

    // 참여자에 현재 사용자 추가
    const allParticipants = [...new Set([userUuid, ...participantUuids])];

    // 1대1 채팅인 경우 친구 관계 확인
    if (type === ChatRoomType.DIRECT) {
      if (allParticipants.length !== 2) {
        throw new BadRequestException(
          '1대1 채팅방은 정확히 2명의 참여자가 필요합니다.',
        );
      }

      const otherUserUuid = allParticipants.find((uuid) => uuid !== userUuid);
      const friendship = await this.friendshipRepository.findOne({
        where: [
          {
            requesterUuid: userUuid,
            addresseeUuid: otherUserUuid,
            status: FriendshipStatus.ACCEPTED,
          },
          {
            requesterUuid: otherUserUuid,
            addresseeUuid: userUuid,
            status: FriendshipStatus.ACCEPTED,
          },
        ],
      });

      if (!friendship) {
        throw new ForbiddenException(
          '친구가 아닌 사용자와는 채팅할 수 없습니다.',
        );
      }

      // 기존 1대1 채팅방 확인 (PostgreSQL 배열 쿼리 사용)
      const existingRoom = await this.chatRoomRepository
        .createQueryBuilder('room')
        .where('room.type = :type', { type: ChatRoomType.DIRECT })
        .andWhere('room.participantUuids = :participantUuids', {
          participantUuids: allParticipants.sort(),
        })
        .getOne();

      if (existingRoom) {
        return this.formatChatRoomResponse(existingRoom, userUuid);
      }
    }

    // 챌린지 그룹 채팅인 경우 챌린지 참여 확인
    if (challengeUuid) {
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        throw new NotFoundException('존재하지 않는 챌린지입니다.');
      }

      // TODO: 챌린지 참여자 확인 로직 추가
    }

    // 채팅방 생성
    const roomUuid = ulid();
    const roomName =
      name || (await this.generateRoomName(allParticipants));
    const chatRoom = this.chatRoomRepository.create({
      roomUuid,
      type,
      name: roomName,
      participantUuids: allParticipants.sort(),
      challengeUuid,
      isActive: true,
    });

    const savedRoom = await this.chatRoomRepository.save(chatRoom);
    this.logger.info('채팅방 생성 완료', { roomUuid, userUuid, type });

    return this.formatChatRoomResponse(savedRoom, userUuid);
  }

  /**
   * 사용자 채팅방 목록 조회
   */
  async getChatRooms(userUuid: string, getChatRoomsDto: GetChatRoomsDto) {
    const { type, page = 1, limit = 20 } = getChatRoomsDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatRoomRepository
      .createQueryBuilder('room')
      .where(':userUuid = ANY(room.participantUuids)', { userUuid })
      .andWhere('room.isActive = :isActive', { isActive: true });

    if (type) {
      queryBuilder.andWhere('room.type = :type', { type });
    }

    const [chatRooms, total] = await queryBuilder
      .orderBy('room.lastMessageAt', 'DESC')
      .addOrderBy('room.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedRooms = await Promise.all(
      chatRooms.map((room) => this.formatChatRoomResponse(room, userUuid)),
    );

    return {
      chatRooms: formattedRooms,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * 특정 채팅방 조회
   */
  async getChatRoom(userUuid: string, roomUuid: string) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    return this.formatChatRoomResponse(chatRoom, userUuid);
  }

  /**
   * 메시지 전송
   */
  async sendMessage(
    userUuid: string,
    roomUuid: string,
    sendMessageDto: SendMessageDto,
  ) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    const { type, content, imageUrl } = sendMessageDto;

    // 메시지 생성
    const message = this.chatMessageRepository.create({
      roomUuid,
      senderUuid: userUuid,
      type,
      content,
      imageUrl,
      isRead: false,
      readByUuids: [userUuid], // 발신자는 자동으로 읽음 처리
    });

    const savedMessage = await this.chatMessageRepository.save(message);

    // 채팅방 마지막 메시지 시간 업데이트
    await this.chatRoomRepository.update(
      { roomUuid },
      { lastMessageAt: savedMessage.createdAt },
    );

    // 메시지 알림 발송 (발신자 제외한 다른 참여자들에게)
    try {
      const otherParticipants = chatRoom.participantUuids.filter(
        (uuid) => uuid !== userUuid,
      );

      if (otherParticipants.length > 0) {
        const sender = await this.userRepository.findOne({
          where: { userUuid },
          select: ['nickname'],
        });

        if (sender) {
          // 그룹 채팅방인 경우 모든 참여자에게, 1대1 채팅방인 경우 상대방에게만 알림
          for (const recipientUuid of otherParticipants) {
            await this.notificationsService.createNewMessageNotification(
              recipientUuid,
              userUuid,
              sender.nickname,
              roomUuid,
              content.length > 50 ? content.substring(0, 50) + '...' : content,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error('메시지 알림 발송 실패:', error);
    }

    this.logger.info('메시지 전송 완료', {
      messageId: savedMessage.id,
      roomUuid,
      senderUuid: userUuid,
    });

    return this.formatMessageResponse(savedMessage, userUuid);
  }

  /**
   * 채팅방 메시지 목록 조회
   */
  async getMessages(
    userUuid: string,
    roomUuid: string,
    getMessagesDto: GetMessagesDto,
  ) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    const { page = 1, limit = 50, lastMessageId } = getMessagesDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatMessageRepository
      .createQueryBuilder('message')
      .where('message.roomUuid = :roomUuid', { roomUuid });

    if (lastMessageId) {
      queryBuilder.andWhere('message.id < :lastMessageId', { lastMessageId });
    }

    const [messages, total] = await queryBuilder
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedMessages = await Promise.all(
      messages.map((message) => this.formatMessageResponse(message, userUuid)),
    );

    return {
      messages: formattedMessages.reverse(), // 시간순 정렬
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasMore: total > skip + limit,
      },
    };
  }

  /**
   * 메시지 읽음 처리
   */
  async markMessagesAsRead(userUuid: string, roomUuid: string) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    if (chatRoom.type === ChatRoomType.DIRECT) {
      // 1대1 채팅: isRead 플래그 업데이트
      await this.chatMessageRepository
        .createQueryBuilder()
        .update(ChatMessage)
        .set({ isRead: true })
        .where('roomUuid = :roomUuid', { roomUuid })
        .andWhere('senderUuid != :userUuid', { userUuid })
        .andWhere('isRead = :isRead', { isRead: false })
        .execute();
    } else {
      // 그룹 채팅: readByUuids 배열에 사용자 추가
      const unreadMessages = await this.chatMessageRepository.find({
        where: { roomUuid },
      });

      for (const message of unreadMessages) {
        if (
          !message.readByUuids.includes(userUuid) &&
          message.senderUuid !== userUuid
        ) {
          message.readByUuids.push(userUuid);
          await this.chatMessageRepository.save(message);
        }
      }
    }

    this.logger.info('메시지 읽음 처리 완료', { roomUuid, userUuid });
    return { success: true };
  }

  /**
   * 채팅방 나가기
   */
  async leaveChatRoom(userUuid: string, roomUuid: string) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
    }

    // 참여자에서 제거
    chatRoom.participantUuids = chatRoom.participantUuids.filter(
      (uuid) => uuid !== userUuid,
    );

    // 참여자가 1명 이하면 채팅방 비활성화
    if (chatRoom.participantUuids.length <= 1) {
      chatRoom.isActive = false;
    }

    await this.chatRoomRepository.save(chatRoom);

    // 시스템 메시지 추가
    if (chatRoom.type === ChatRoomType.GROUP && chatRoom.isActive) {
      const user = await this.userRepository.findOne({ where: { userUuid } });
      const systemMessage = this.chatMessageRepository.create({
        roomUuid,
        senderUuid: 'system',
        type: MessageType.SYSTEM,
        content: `${user?.nickname || '사용자'}님이 채팅방을 나갔습니다.`,
        isRead: true,
        readByUuids: chatRoom.participantUuids,
      });

      await this.chatMessageRepository.save(systemMessage);
    }

    this.logger.info('채팅방 나가기 완료', { roomUuid, userUuid });
    return { success: true, message: '채팅방을 나갔습니다.' };
  }

  /**
   * 챌린지 채팅방에 참여자 추가
   */
  async addParticipantToChallengeRoom(challengeUuid: string, userUuid: string) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { challengeUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('챌린지 채팅방을 찾을 수 없습니다.');
    }

    if (chatRoom.participantUuids.includes(userUuid)) {
      this.logger.warn('이미 채팅방에 참여한 사용자입니다.', {
        challengeUuid,
        userUuid,
      });
      return;
    }

    chatRoom.participantUuids.push(userUuid);
    await this.chatRoomRepository.save(chatRoom);

    // 참여 시스템 메시지 추가
    const user = await this.userRepository.findOne({ where: { userUuid } });
    const systemMessage = this.chatMessageRepository.create({
      roomUuid: chatRoom.roomUuid,
      senderUuid: 'system',
      type: MessageType.SYSTEM,
      content: `${user?.nickname || '사용자'}님이 채팅방에 참여했습니다.`,
      isRead: false,
      readByUuids: [],
    });

    await this.chatMessageRepository.save(systemMessage);
    this.logger.info('챌린지 채팅방 참여자 추가 완료', {
      challengeUuid,
      userUuid,
    });
  }

  /**
   * 챌린지 채팅방에서 참여자 제거
   */
  async removeParticipantFromChallengeRoom(
    challengeUuid: string,
    userUuid: string,
  ) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { challengeUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('챌린지 채팅방을 찾을 수 없습니다.');
    }

    if (!chatRoom.participantUuids.includes(userUuid)) {
      this.logger.warn('채팅방에 참여하지 않은 사용자입니다.', {
        challengeUuid,
        userUuid,
      });
      return;
    }

    chatRoom.participantUuids = chatRoom.participantUuids.filter(
      (uuid) => uuid !== userUuid,
    );

    await this.chatRoomRepository.save(chatRoom);

    // 나가기 시스템 메시지 추가
    const user = await this.userRepository.findOne({ where: { userUuid } });
    const systemMessage = this.chatMessageRepository.create({
      roomUuid: chatRoom.roomUuid,
      senderUuid: 'system',
      type: MessageType.SYSTEM,
      content: `${user?.nickname || '사용자'}님이 채팅방을 나갔습니다.`,
      isRead: false,
      readByUuids: [],
    });

    await this.chatMessageRepository.save(systemMessage);
    this.logger.info('챌린지 채팅방 참여자 제거 완료', {
      challengeUuid,
      userUuid,
    });
  }

  /**
   * 채팅방 응답 포맷팅
   */
  private async formatChatRoomResponse(
    chatRoom: ChatRoom,
    currentUserUuid: string,
  ) {
    // 참여자 정보 조회
    const participants = await this.userRepository.find({
      where: { userUuid: In(chatRoom.participantUuids) },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    // 마지막 메시지 조회
    const lastMessage = await this.chatMessageRepository.findOne({
      where: { roomUuid: chatRoom.roomUuid },
      order: { createdAt: 'DESC' },
    });

    // 읽지 않은 메시지 수 계산
    const unreadCount = await this.getUnreadMessageCount(
      chatRoom.roomUuid,
      currentUserUuid,
      chatRoom.type,
    );

    return {
      roomUuid: chatRoom.roomUuid,
      type: chatRoom.type,
      name: chatRoom.name,
      participants: participants.map((p) => ({
        userUuid: p.userUuid,
        nickname: p.nickname,
        profileImage: p.profileImage,
      })),
      challengeUuid: chatRoom.challengeUuid,
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            type: lastMessage.type,
            content: lastMessage.content,
            senderUuid: lastMessage.senderUuid,
            createdAt: lastMessage.createdAt,
          }
        : null,
      lastMessageAt: chatRoom.lastMessageAt,
      unreadCount,
      createdAt: chatRoom.createdAt,
      requesterUuid: currentUserUuid,
    };
  }

  /**
   * 메시지 응답 포맷팅
   */
  private async formatMessageResponse(
    message: ChatMessage,
    currentUserUuid: string,
  ) {
    const sender = await this.userRepository.findOne({
      where: { userUuid: message.senderUuid },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    return {
      id: message.id,
      roomUuid: message.roomUuid,
      type: message.type,
      content: message.content,
      imageUrl: message.imageUrl,
      sender: sender
        ? {
            userUuid: sender.userUuid,
            nickname: sender.nickname,
            profileImage: sender.profileImage,
          }
        : null,
      isRead: message.isRead,
      readByUuids: message.readByUuids,
      isMyMessage: message.senderUuid === currentUserUuid,
      createdAt: message.createdAt,
    };
  }

  /**
   * 읽지 않은 메시지 수 계산
   */
  private async getUnreadMessageCount(
    roomUuid: string,
    userUuid: string,
    roomType: ChatRoomType,
  ): Promise<number> {
    if (roomType === ChatRoomType.DIRECT) {
      return await this.chatMessageRepository.count({
        where: {
          roomUuid,
          senderUuid: { $ne: userUuid } as any,
          isRead: false,
        },
      });
    } else {
      // 그룹 채팅의 경우 readByUuids에 포함되지 않은 메시지 수
      const messages = await this.chatMessageRepository.find({
        where: { roomUuid },
        select: ['id', 'senderUuid', 'readByUuids'],
      });

      return messages.filter(
        (message) =>
          message.senderUuid !== userUuid &&
          !message.readByUuids.includes(userUuid),
      ).length;
    }
  }

  /**
   * 채팅방 이름 생성 (1대1 채팅용)
   */
  private async generateRoomName(
    participantUuids: string[],
    currentUserUuid: string,
  ): Promise<string> {
    const otherUuids = participantUuids.filter(
      (uuid) => uuid !== currentUserUuid,
    );
    const users = await this.userRepository.find({
      where: { userUuid: In(otherUuids) },
      select: ['nickname'],
    });

    return users.map((user) => user.nickname).join(', ');
  }

  /**
   * 채팅방 입장
   */
  async joinChatRoom(userUuid: string, roomUuid: string) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { roomUuid, isActive: true },
    });

    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }

    // 이미 참여 중인지 확인
    if (chatRoom.participantUuids.includes(userUuid)) {
      // 이미 참여 중이어도 성공 응답 반환
      const roomResponse = await this.formatChatRoomResponse(
        chatRoom,
        userUuid,
      );
      return {
        success: true,
        message: '이미 참여 중인 채팅방입니다.',
        chatRoom: roomResponse,
      };
    }

    // 1대1 채팅방은 입장 불가
    if (chatRoom.type === ChatRoomType.DIRECT) {
      throw new ForbiddenException(
        '1대1 채팅방에는 추가로 입장할 수 없습니다.',
      );
    }

    // 챌린지 채팅방인 경우 챌린지 참여 여부 확인
    if (chatRoom.challengeUuid) {
      // TODO: 챌린지 참여 여부 확인 로직
      // 현재는 챌린지 참여 확인 없이 입장 허용
    }

    // 참여자 목록에 추가
    chatRoom.participantUuids.push(userUuid);
    await this.chatRoomRepository.save(chatRoom);

    // 입장 시스템 메시지 추가
    const user = await this.userRepository.findOne({ where: { userUuid } });
    const systemMessage = this.chatMessageRepository.create({
      roomUuid: chatRoom.roomUuid,
      senderUuid: 'system',
      type: MessageType.SYSTEM,
      content: `${user?.nickname || '사용자'}님이 채팅방에 입장했습니다.`,
      isRead: false,
      readByUuids: [],
    });

    await this.chatMessageRepository.save(systemMessage);

    this.logger.info('채팅방 입장 완료', { roomUuid, userUuid });

    const roomResponse = await this.formatChatRoomResponse(chatRoom, userUuid);
    return {
      success: true,
      message: '채팅방에 입장했습니다.',
      chatRoom: roomResponse,
    };
  }
}
