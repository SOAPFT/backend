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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  ApiCreateNotification,
  ApiGetNotifications,
  ApiMarkAsRead,
  ApiDeleteNotification,
  ApiGetUnreadCount,
} from './decorators/notifications.swagger';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 새 알림 생성 (시스템용 - 관리자 권한 필요)
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
