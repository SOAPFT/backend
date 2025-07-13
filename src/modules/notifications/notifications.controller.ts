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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { ApnsPushService } from './apns-push.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import {
  SendPushDto,
  SendPushMultipleDto,
  SendTestPushDto,
} from './dto/send-push.dto';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  ApiCreateNotification,
  ApiGetNotifications,
  ApiMarkAsRead,
  ApiDeleteNotification,
  ApiGetUnreadCount,
  ApiSendPush,
  ApiSendPushMultiple,
  ApiSendTestPush,
  ApiGetPushStatus,
} from './decorators/notifications.swagger';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly apnsPushService: ApnsPushService,
  ) {}

  /**
   * 새 알림 생성
   */
  @Post()
  @ApiCreateNotification()
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  /**
   * 사용자의 알림 목록 조회
   */
  @Get()
  @ApiGetNotifications()
  getNotifications(
    @Query() getNotificationsDto: GetNotificationsDto,
    @UserUuid() userUuid: string,
  ) {
    return this.notificationsService.getNotifications(
      userUuid,
      getNotificationsDto,
    );
  }

  /**
   * 미읽음 알림 개수 조회
   */
  @Get('unread-count')
  @ApiGetUnreadCount()
  getUnreadCount(@UserUuid() userUuid: string) {
    return this.notificationsService.getUnreadCount(userUuid);
  }

  /**
   * 푸시알림 서비스 상태 확인
   */
  @Get('push/status')
  @ApiGetPushStatus()
  getPushStatus() {
    const isReady = this.apnsPushService.isReady();
    return {
      isReady,
      status: isReady ? 'connected' : 'disconnected',
      message: isReady
        ? 'APNs 서비스가 정상적으로 동작중입니다.'
        : 'APNs 서비스가 연결되지 않았습니다.',
    };
  }

  /**
   * 단일 푸시알림 전송
   */
  @Post('push/send')
  @ApiSendPush()
  sendPush(@Body() sendPushDto: SendPushDto) {
    return this.apnsPushService.sendToDevice(sendPushDto.deviceToken, {
      title: sendPushDto.title,
      body: sendPushDto.body,
      badge: sendPushDto.badge,
      sound: sendPushDto.sound,
      data: sendPushDto.data,
      category: sendPushDto.category,
    });
  }

  /**
   * 다중 푸시알림 전송
   */
  @Post('push/send-multiple')
  @ApiSendPushMultiple()
  sendPushMultiple(@Body() sendPushMultipleDto: SendPushMultipleDto) {
    return this.apnsPushService.sendToDevices(
      sendPushMultipleDto.deviceTokens,
      {
        title: sendPushMultipleDto.title,
        body: sendPushMultipleDto.body,
        badge: sendPushMultipleDto.badge,
        sound: sendPushMultipleDto.sound,
        data: sendPushMultipleDto.data,
        category: sendPushMultipleDto.category,
      },
    );
  }

  /**
   * 테스트 푸시알림 전송
   */
  @Post('push/test')
  @ApiSendTestPush()
  async sendTestPush(@Body() sendTestPushDto: SendTestPushDto) {
    const result = await this.apnsPushService.sendTestPush(
      sendTestPushDto.deviceToken,
    );
    return {
      ...result,
      message: '테스트 푸시알림이 전송되었습니다.',
    };
  }

  /**
   * 알림 읽음 처리
   */
  @Patch('mark-as-read')
  @ApiMarkAsRead()
  markAsRead(
    @Body() markAsReadDto: MarkAsReadDto,
    @UserUuid() userUuid: string,
  ) {
    return this.notificationsService.markAsRead(userUuid, markAsReadDto);
  }

  /**
   * 모든 알림 읽음 처리
   */
  @Patch('mark-all-as-read')
  @ApiMarkAsRead()
  markAllAsRead(@UserUuid() userUuid: string) {
    return this.notificationsService.markAsRead(userUuid);
  }

  /**
   * 알림 삭제
   */
  @Delete(':id')
  @ApiDeleteNotification()
  deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @UserUuid() userUuid: string,
  ) {
    return this.notificationsService.deleteNotification(userUuid, id);
  }
}
