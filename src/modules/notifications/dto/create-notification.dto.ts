import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationType } from '@/types/notification.enum';

export class CreateNotificationDto {
  @IsString()
  recipientUuid: string;

  @IsString()
  @IsOptional()
  senderUuid?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsObject()
  @IsOptional()
  data?: any;
}
