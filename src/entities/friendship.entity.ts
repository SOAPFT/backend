import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { FriendshipStatus } from '@/types/friendship.enum';

@Entity('friendship')
@Unique(['requesterUuid', 'addresseeUuid'])
export class Friendship {
  /** 친구관계 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 친구요청을 보낸 사용자 ULID */
  @Column({ name: 'requester_uuid', type: 'varchar', length: 26 })
  requesterUuid: string;

  /** 친구요청을 받은 사용자 ULID */
  @Column({ name: 'addressee_uuid', type: 'varchar', length: 26 })
  addresseeUuid: string;

  /** 친구관계 상태 (요청중, 수락, 거절, 차단) */
  @Column({
    name: 'status',
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  /** 친구관계 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 친구관계 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
