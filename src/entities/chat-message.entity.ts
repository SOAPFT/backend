import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType } from '@/types/chat.enum';

@Entity('chat_message')
export class ChatMessage {
  /** 메시지 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 메시지가 속한 채팅방 ULID */
  @Column({ name: 'room_uuid', type: 'varchar', length: 26 })
  roomUuid: string;

  /** 메시지 발신자 ULID */
  @Column({ name: 'sender_uuid', type: 'varchar', length: 26 })
  senderUuid: string;

  /** 메시지 타입 (텍스트, 이미지, 시스템 메시지) */
  @Column({
    name: 'type',
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  /** 메시지 내용 */
  @Column({ name: 'content', type: 'text' })
  content: string;

  /** 첨부 이미지 URL (이미지 메시지인 경우) */
  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  /** 메시지 읽음 상태 (1대1 채팅용) */
  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  /** 메시지를 읽은 사용자 ULID 배열 (그룹채팅용) */
  @Column({
    name: 'read_by_uuids',
    type: 'varchar',
    array: true,
    default: '{}',
  })
  readByUuids: string[];

  /** 메시지 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 메시지 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
