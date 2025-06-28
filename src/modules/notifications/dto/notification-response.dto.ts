import { NotificationType } from '@/types/notification.enum';

export class NotificationResponseDto {
  id: number;
  recipientUuid: string;
  senderUuid?: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: any;
  isRead: boolean;
  isSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationListResponseDto {
  notifications: NotificationResponseDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  unreadCount: number;
}
