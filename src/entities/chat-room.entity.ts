import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoomType } from '../types/chat.enum';

@Entity('chat_room')
export class ChatRoom {
  /** 채팅방 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 채팅방 ULID */
  @Column({ name: 'room_uuid', type: 'varchar', length: 26, unique: true })
  roomUuid: string;

  /** 채팅방 타입 (1대1, 그룹채팅) */
  @Column({
    name: 'type',
    type: 'enum',
    enum: ChatRoomType,
  })
  type: ChatRoomType;

  /** 채팅방 이름 (그룹채팅인 경우) */
  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  /** 참여자 ULID 배열 */
  @Column({ name: 'participant_uuids', type: 'varchar', array: true })
  participantUuids: string[];

  /** 연동된 챌린지 ULID (챌린지 그룹채팅인 경우) */
  @Column({
    name: 'challenge_uuid',
    type: 'varchar',
    length: 26,
    nullable: true,
  })
  challengeUuid: string;

  /** 채팅방 활성화 상태 */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /** 마지막 메시지 전송일시 */
  @Column({ name: 'last_message_at', type: 'timestamptz', nullable: true })
  lastMessageAt: Date;

  /** 채팅방 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 채팅방 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
