import { Injectable, Logger } from '@nestjs/common';
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
import { UserPushService } from './user-push.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userPushService: UserPushService,
  ) {}

  /**
   * 새 알림 생성 + 푸시 알림 발송
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

    // 알림 저장
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    const savedNotification =
      await this.notificationRepository.save(notification);

    // 푸시 알림 발송 (비동기)
    this.sendPushNotificationAsync(savedNotification);

    return this.mapToResponseDto(savedNotification);
  }

  /**
   * 비동기 푸시 알림 발송
   */
  private async sendPushNotificationAsync(
    notification: Notification,
  ): Promise<void> {
    try {
      // 미읽음 알림 개수 조회
      const unreadCount = await this.notificationRepository.count({
        where: {
          recipientUuid: notification.recipientUuid,
          isRead: false,
        },
      });

      // 푸시 알림 발송
      const result = await this.userPushService.sendPushToUser(
        notification.recipientUuid,
        {
          title: notification.title,
          body: notification.content,
          badge: unreadCount,
          data: {
            notificationId: notification.id,
            type: notification.type,
            ...notification.data,
          },
        },
      );

      // 발송 상태 업데이트
      if (result.sent > 0) {
        await this.notificationRepository.update(notification.id, {
          isSent: true,
        });
      }

      this.logger.log(
        `푸시 알림 발송 완료 - 성공: ${result.sent}, 실패: ${result.failed}`,
      );
    } catch (error) {
      this.logger.error('푸시 알림 발송 실패:', error);
    }
  }

  /**
   * 여러 사용자에게 동일한 알림 발송
   */
  async createBulkNotifications(
    recipientUuids: string[],
    notificationData: Omit<CreateNotificationDto, 'recipientUuid'>,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // 알림들을 먼저 저장
    const notifications: Notification[] = [];

    for (const recipientUuid of recipientUuids) {
      try {
        const notification = this.notificationRepository.create({
          ...notificationData,
          recipientUuid,
        });
        const savedNotification =
          await this.notificationRepository.save(notification);
        notifications.push(savedNotification);
        success++;
      } catch (error) {
        this.logger.error(`알림 저장 실패: ${recipientUuid}`, error);
        failed++;
      }
    }

    // 성공적으로 저장된 알림들에 대해 푸시 발송
    if (notifications.length > 0) {
      this.sendBulkPushNotificationAsync(notifications);
    }

    this.logger.log(`대량 알림 생성 완료 - 성공: ${success}, 실패: ${failed}`);
    return { success, failed };
  }

  /**
   * 대량 푸시 알림 발송
   */
  private async sendBulkPushNotificationAsync(
    notifications: Notification[],
  ): Promise<void> {
    try {
      const userUuids = notifications.map((n) => n.recipientUuid);

      // 각 사용자의 미읽음 개수 조회는 생략하고 기본값 사용
      // (성능을 위해 - 필요시 개별 조회 로직 추가 가능)

      const result = await this.userPushService.sendPushToUsers(userUuids, {
        title: notifications[0].title, // 동일한 제목이라 가정
        body: notifications[0].content, // 동일한 내용이라 가정
        badge: 1, // 기본 배지값
        data: {
          type: notifications[0].type,
          // 개별 데이터는 생략 (대량 발송시)
        },
      });

      // 발송 성공한 알림들의 상태 업데이트
      if (result.sent > 0) {
        const notificationIds = notifications.map((n) => n.id);
        await this.notificationRepository.update(
          { id: In(notificationIds) },
          { isSent: true },
        );
      }

      this.logger.log(
        `대량 푸시 발송 완료 - 성공: ${result.sent}, 실패: ${result.failed}`,
      );
    } catch (error) {
      this.logger.error('대량 푸시 발송 실패:', error);
    }
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
   * 친구 요청 알림 생성
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
   * 친구 수락 알림 생성
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
   * 챌린지 초대 알림 생성
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
   * 게시글 좋아요 알림 생성
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
   * 게시글 댓글 알림 생성
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
   * 새 메시지 알림 생성
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

  /**
   * 챌린지 시작 알림 생성
   */
  async createChallengeStartNotification(
    recipientUuids: string[],
    challengeTitle: string,
    challengeUuid: string,
  ): Promise<{ success: number; failed: number }> {
    return this.createBulkNotifications(recipientUuids, {
      senderUuid: null,
      type: NotificationType.CHALLENGE_START,
      title: '챌린지가 시작되었습니다',
      content: `"${challengeTitle}" 챌린지가 시작되었습니다. 지금부터 인증을 시작해보세요!`,
      data: { challengeUuid, challengeTitle },
    });
  }

  /**
   * 챌린지 종료 알림 생성
   */
  async createChallengeEndNotification(
    recipientUuids: string[],
    challengeTitle: string,
    challengeUuid: string,
    isSuccess: boolean,
  ): Promise<{ success: number; failed: number }> {
    const title = '챌린지가 종료되었습니다';
    const content = isSuccess
      ? `축하합니다! "${challengeTitle}" 챌린지를 성공적으로 완료했습니다.`
      : `"${challengeTitle}" 챌린지가 종료되었습니다. 다음 기회에 도전해보세요!`;

    return this.createBulkNotifications(recipientUuids, {
      senderUuid: null,
      type: NotificationType.CHALLENGE_END,
      title,
      content,
      data: { challengeUuid, challengeTitle, isSuccess },
    });
  }

  /**
   * 챌린지 시작 리마인드 알림 생성 (하루 전)
   */
  async createChallengeReminderNotification(
    recipientUuids: string[],
    challengeTitle: string,
    challengeUuid: string,
  ): Promise<{ success: number; failed: number }> {
    return this.createBulkNotifications(recipientUuids, {
      senderUuid: null,
      type: NotificationType.CHALLENGE_REMINDER,
      title: '챌린지 시작 하루 전입니다',
      content: `내일 "${challengeTitle}" 챌린지가 시작됩니다. 준비하세요!`,
      data: { challengeUuid, challengeTitle },
    });
  }

  /**
   * 전체미션 생성 알림
   */
  async createMissionCreatedNotification(
    recipientUuids: string[],
    missionTitle: string,
    missionId: number,
    description?: string,
  ): Promise<{ success: number; failed: number }> {
    return this.createBulkNotifications(recipientUuids, {
      senderUuid: null,
      type: NotificationType.MISSION_CREATED,
      title: '새로운 전체 미션이 생성되었습니다',
      content: `"${missionTitle}" 미션에 참여해보세요!${description ? ` - ${description}` : ''}`,
      data: { missionId, missionTitle, description },
    });
  }

  /**
   * 미션 시작 리마인드 알림 생성 (하루 전)
   */
  async createMissionReminderNotification(
    recipientUuids: string[],
    missionTitle: string,
    missionId: number,
  ): Promise<{ success: number; failed: number }> {
    return this.createBulkNotifications(recipientUuids, {
      senderUuid: null,
      type: NotificationType.MISSION_REMINDER,
      title: '미션 시작 하루 전입니다',
      content: `내일 "${missionTitle}" 미션이 시작됩니다. 준비하세요!`,
      data: { missionId, missionTitle },
    });
  }

  /**
   * 멘션 알림 생성
   */
  async createMentionNotification(
    recipientUuid: string,
    senderUuid: string,
    senderNickname: string,
    postUuid: string,
    mentionContext: string,
  ): Promise<NotificationResponseDto> {
    return this.createNotification({
      recipientUuid,
      senderUuid,
      type: NotificationType.MENTION,
      title: '누군가 회원님을 언급했습니다',
      content: `${senderNickname}님이 회원님을 언급했습니다: "${mentionContext}"`,
      data: { senderUuid, senderNickname, postUuid, mentionContext },
    });
  }
}
