import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../types/notification.enum';

@Entity('notification')
export class Notification {
  /** 알림 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 알림 수신자 ULID */
  @Column({ name: 'recipient_uuid', type: 'varchar', length: 26 })
  recipientUuid: string;

  /** 알림 발신자 ULID (시스템 알림인 경우 null) */
  @Column({ name: 'sender_uuid', type: 'varchar', length: 26, nullable: true })
  senderUuid: string;

  /** 알림 타입 (친구요청, 챌린지 시작, 새 메시지 등) */
  @Column({
    name: 'type',
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  /** 알림 제목 */
  @Column({ name: 'title', type: 'varchar' })
  title: string;

  /** 알림 내용 */
  @Column({ name: 'content', type: 'text' })
  content: string;

  /** 추가 데이터 (JSON 형태, 딥링크 정보 등) */
  @Column({ name: 'data', type: 'json', nullable: true })
  data: any;

  /** 알림 읽음 상태 */
  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  /** 푸시 알림 전송 완료 상태 */
  @Column({ name: 'is_sent', type: 'boolean', default: false })
  isSent: boolean;

  /** 알림 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 알림 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
