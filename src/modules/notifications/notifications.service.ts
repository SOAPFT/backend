import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from '@/entities/notification.entity';
import { User } from '@/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';
import { NotificationType } from '@/types/notification.enum';
import { BusinessException } from '@/utils/custom-exception';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 새 알림 생성
   */
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    // 수신자 존재 확인
    const recipient = await this.userRepository.findOne({
      where: { userUuid: createNotificationDto.recipientUuid },
    });

    if (!recipient) {
      BusinessException.userNotFound(createNotificationDto.recipientUuid);
    }

    // 발신자 존재 확인 (선택적)
    if (createNotificationDto.senderUuid) {
      const sender = await this.userRepository.findOne({
        where: { userUuid: createNotificationDto.senderUuid },
      });

      if (!sender) {
        BusinessException.userNotFound(createNotificationDto.senderUuid);
      }
    }

    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    const savedNotification =
      await this.notificationRepository.save(notification);

    return this.mapToResponseDto(savedNotification);
  }

  /**
   * 사용자의 알림 목록 조회 (페이지네이션)
   */
  async getNotifications(
    userUuid: string,
    getNotificationsDto: GetNotificationsDto,
  ): Promise<NotificationListResponseDto> {
    const { page = 1, limit = 20, unreadOnly, type } = getNotificationsDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.recipientUuid = :userUuid', { userUuid })
      .orderBy('notification.createdAt', 'DESC');

    // 미읽음 알림만 필터링
    if (unreadOnly) {
      queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    // 알림 타입 필터링
    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    // 전체 개수 조회
    const totalItems = await queryBuilder.getCount();

    // 페이지네이션 적용
    const notifications = await queryBuilder.skip(skip).take(limit).getMany();

    // 미읽음 알림 개수 조회
    const unreadCount = await this.notificationRepository.count({
      where: {
        recipientUuid: userUuid,
        isRead: false,
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      notifications: notifications.map((notification) =>
        this.mapToResponseDto(notification),
      ),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      unreadCount,
    };
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(
    userUuid: string,
    markAsReadDto?: MarkAsReadDto,
  ): Promise<{ success: boolean; message: string }> {
    let updateResult;

    if (
      markAsReadDto?.notificationIds &&
      markAsReadDto.notificationIds.length > 0
    ) {
      // 특정 알림들만 읽음 처리
      updateResult = await this.notificationRepository.update(
        {
          id: In(markAsReadDto.notificationIds),
          recipientUuid: userUuid,
          isRead: false,
        },
        { isRead: true },
      );
    } else {
      // 모든 미읽음 알림을 읽음 처리
      updateResult = await this.notificationRepository.update(
        {
          recipientUuid: userUuid,
          isRead: false,
        },
        { isRead: true },
      );
    }

    return {
      success: true,
      message: `${updateResult.affected || 0}개의 알림이 읽음 처리되었습니다.`,
    };
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(
    userUuid: string,
    notificationId: number,
  ): Promise<{ success: boolean; message: string }> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        recipientUuid: userUuid,
      },
    });

    if (!notification) {
      BusinessException.notificationNotFound(notificationId);
    }

    await this.notificationRepository.remove(notification);

    return {
      success: true,
      message: '알림이 삭제되었습니다.',
    };
  }

  /**
   * 사용자의 미읽음 알림 개수 조회
   */
  async getUnreadCount(userUuid: string): Promise<{ unreadCount: number }> {
    const unreadCount = await this.notificationRepository.count({
      where: {
        recipientUuid: userUuid,
        isRead: false,
      },
    });

    return { unreadCount };
  }

  /**
   * 알림 엔티티를 응답 DTO로 변환
   */
  private mapToResponseDto(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      recipientUuid: notification.recipientUuid,
      senderUuid: notification.senderUuid,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      data: notification.data,
      isRead: notification.isRead,
      isSent: notification.isSent,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  /**
   * 친구 요청 알림 생성 (다른 모듈에서 호출)
   */
  async createFriendRequestNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.FRIEND_REQUEST,
      title: '친구 요청이 도착했습니다',
      content: `${senderNickname}님이 친구 요청을 보냈습니다.`,
      data: { senderUuid, senderNickname },
    });
  }

  /**
   * 친구 수락 알림 생성 (다른 모듈에서 호출)
   */
  async createFriendAcceptedNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.FRIEND_ACCEPTED,
      title: '친구 요청이 수락되었습니다',
      content: `${senderNickname}님이 친구 요청을 수락했습니다.`,
      data: { senderUuid, senderNickname },
    });
  }

  /**
   * 챌린지 초대 알림 생성 (다른 모듈에서 호출)
   */
  async createChallengeInviteNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
    challengeTitle: string,
    challengeUuid: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.CHALLENGE_INVITE,
      title: '챌린지 초대가 도착했습니다',
      content: `${senderNickname}님이 "${challengeTitle}" 챌린지에 초대했습니다.`,
      data: { senderUuid, senderNickname, challengeUuid, challengeTitle },
    });
  }

  /**
   * 게시글 좋아요 알림 생성 (다른 모듈에서 호출)
   */
  async createPostLikeNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
    postUuid: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.POST_LIKE,
      title: '게시글에 좋아요가 달렸습니다',
      content: `${senderNickname}님이 회원님의 게시글에 좋아요를 눌렀습니다.`,
      data: { senderUuid, senderNickname, postUuid },
    });
  }

  /**
   * 게시글 댓글 알림 생성 (다른 모듈에서 호출)
   */
  async createPostCommentNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
    postUuid: string,
    commentContent: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.POST_COMMENT,
      title: '게시글에 댓글이 달렸습니다',
      content: `${senderNickname}님이 회원님의 게시글에 댓글을 달았습니다: "${commentContent}"`,
      data: { senderUuid, senderNickname, postUuid, commentContent },
    });
  }

  /**
   * 새 메시지 알림 생성 (다른 모듈에서 호출)
   */
  async createNewMessageNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
    chatRoomUuid: string,
    messageContent: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.NEW_MESSAGE,
      title: '새 메시지가 도착했습니다',
      content: `${senderNickname}: ${messageContent}`,
      data: { senderUuid, senderNickname, chatRoomUuid, messageContent },
    });
  }
}
