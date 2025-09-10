import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Logger } from 'winston';
import { ChatService } from '../chat/chat.service';
import { Challenge } from '@/entities/challenge.entity';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { ChatRoom } from '@/entities/chat-room.entity';
import { MessageType } from '@/types/chat.enum';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    private readonly chatService: ChatService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  /**
   * 인증 완료 알림 메시지 전송
   */
  async sendAuthCompletionMessage(
    userUuid: string,
    challengeUuid: string,
    postUuid: string,
  ) {
    try {
      // 사용자 정보 조회
      const user = await this.userRepository.findOne({
        where: { userUuid },
        select: ['nickname'],
      });

      if (!user) {
        this.logger.error('사용자를 찾을 수 없습니다:', { userUuid });
        return;
      }

      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        this.logger.warn('챌린지 채팅방을 찾을 수 없습니다:', {
          challengeUuid,
        });
        return;
      }

      // 축하 메시지 전송
      const message = `🎉 ${user.nickname}님이 인증을 완료했어요! 오늘도 화이팅! 💪`;

      await this.chatService.sendMessage('system', chatRoom.roomUuid, {
        type: MessageType.SYSTEM,
        content: message,
      });

      this.logger.info('인증 완료 알림 전송 완료', {
        userUuid,
        challengeUuid,
        postUuid,
      });
    } catch (error) {
      this.logger.error('인증 완료 알림 전송 실패:', error);
    }
  }

  /**
   * 일일 인증 리마인더 메시지 전송
   */
  async sendDailyReminder(challengeUuid: string) {
    try {
      // 챌린지 정보 조회
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        this.logger.error('챌린지를 찾을 수 없습니다:', { challengeUuid });
        return;
      }

      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        this.logger.warn('챌린지 채팅방을 찾을 수 없습니다:', {
          challengeUuid,
        });
        return;
      }

      // 오늘 인증한 사용자들 조회
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayPosts = await this.postRepository.find({
        where: {
          challengeUuid,
          createdAt: Between(today, tomorrow),
        },
        select: ['userUuid'],
      });

      const authenticatedUsers = new Set(
        todayPosts.map((post) => post.userUuid),
      );
      const totalParticipants = chatRoom.participantUuids.length;
      const authenticatedCount = authenticatedUsers.size;
      const remainingCount = totalParticipants - authenticatedCount;

      let message: string;

      if (remainingCount === 0) {
        message = `🎉 모든 참여자가 오늘 인증을 완료했어요! 정말 대단해요! 👏`;
      } else if (remainingCount <= 2) {
        message = `⏰ 6시 인증 리마인더입니다!\n아직 ${remainingCount}명이 인증하지 않았어요. 오늘도 함께 해요! 💪`;
      } else {
        message = `⏰ 6시 인증 리마인더입니다!\n오늘 인증: ${authenticatedCount}/${totalParticipants}명\n아직 인증하지 않은 분들, 힘내세요! 🔥`;
      }

      await this.chatService.sendMessage('system', chatRoom.roomUuid, {
        type: MessageType.SYSTEM,
        content: message,
      });

      this.logger.info('일일 리마인더 전송 완료', {
        challengeUuid,
        authenticatedCount,
        totalParticipants,
      });
    } catch (error) {
      this.logger.error('일일 리마인더 전송 실패:', error);
    }
  }

  /**
   * 모든 참여자 인증 완료 축하 메시지
   */
  async sendGroupCompletionMessage(challengeUuid: string) {
    try {
      // 챌린지 정보 조회
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        this.logger.error('챌린지를 찾을 수 없습니다:', { challengeUuid });
        return;
      }

      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        this.logger.warn('챌린지 채팅방을 찾을 수 없습니다:', {
          challengeUuid,
        });
        return;
      }

      // 축하 메시지 전송
      const messages = [`모든 참여자가 인증을 완료했어요! 🎉`];

      for (const message of messages) {
        await this.chatService.sendMessage('system', chatRoom.roomUuid, {
          type: MessageType.SYSTEM,
          content: message,
        });

        // 메시지 간 간격 (1초)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.logger.info('그룹 완료 축하 메시지 전송 완료', { challengeUuid });
    } catch (error) {
      this.logger.error('그룹 완료 축하 메시지 전송 실패:', error);
    }
  }

  /**
   * 오늘 모든 참여자가 인증했는지 확인
   */
  async checkAllParticipantsAuthenticated(
    challengeUuid: string,
  ): Promise<boolean> {
    try {
      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        return false;
      }

      // 오늘 인증한 사용자들 조회
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayPosts = await this.postRepository.find({
        where: {
          challengeUuid,
          createdAt: Between(today, tomorrow),
        },
        select: ['userUuid'],
      });

      const authenticatedUsers = new Set(
        todayPosts.map((post) => post.userUuid),
      );
      const totalParticipants = chatRoom.participantUuids.length;

      return authenticatedUsers.size === totalParticipants;
    } catch (error) {
      this.logger.error('참여자 인증 상태 확인 실패:', error);
      return false;
    }
  }

  /**
   * 새 참여자 환영 메시지
   */
  async sendWelcomeMessage(challengeUuid: string, newUserUuid: string) {
    try {
      // 새 참여자 정보 조회
      const user = await this.userRepository.findOne({
        where: { userUuid: newUserUuid },
        select: ['nickname'],
      });

      if (!user) {
        return;
      }

      // 챌린지 정보 조회
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        return;
      }

      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        return;
      }

      // 환영 메시지 전송
      const message = `🎉 ${user.nickname}님이 "${challenge.title}" 챌린지에 참여했어요!\n함께 열심히 해봐요! 💪`;

      await this.chatService.sendMessage('system', chatRoom.roomUuid, {
        type: MessageType.SYSTEM,
        content: message,
      });

      this.logger.info('환영 메시지 전송 완료', {
        challengeUuid,
        newUserUuid,
      });
    } catch (error) {
      this.logger.error('환영 메시지 전송 실패:', error);
    }
  }

  /**
   * 챌린지 종료 메시지
   */
  async sendChallengeEndMessage(challengeUuid: string) {
    try {
      // 챌린지 정보 조회
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        return;
      }

      // 챌린지 채팅방 조회
      const chatRoom = await this.chatRoomRepository.findOne({
        where: { challengeUuid, isActive: true },
      });

      if (!chatRoom) {
        return;
      }

      // 종료 메시지 전송
      const messages = [
        `"${challenge.title}" 챌린지가 종료되었습니다!`,
        `그동안의 노력과 성취를 축하드립니다 🎉`,
        `새로운 도전을 위해 또 다른 챌린지에서 만나요!`,
      ];

      for (const message of messages) {
        await this.chatService.sendMessage('system', chatRoom.roomUuid, {
          type: MessageType.SYSTEM,
          content: message,
        });

        // 메시지 간 간격 (1초)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.logger.info('챌린지 종료 메시지 전송 완료', { challengeUuid });
    } catch (error) {
      this.logger.error('챌린지 종료 메시지 전송 실패:', error);
    }
  }
}
