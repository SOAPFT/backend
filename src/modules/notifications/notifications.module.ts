import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Notification } from '@/entities/notification.entity';
import { User } from '@/entities/user.entity';
import { NotificationsController } from './notifications.controller';
import { PushTokenController } from './push-token.controller';
import { NotificationsService } from './notifications.service';
import { ApnsPushService } from './apns-push.service';
import { UserPushService } from './user-push.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), ConfigModule],
  controllers: [NotificationsController, PushTokenController],
  providers: [NotificationsService, ApnsPushService, UserPushService],
  exports: [NotificationsService, UserPushService],
})
export class NotificationsModule {}
