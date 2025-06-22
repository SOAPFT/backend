import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('like')
export class Like {
  /** 좋아요 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 좋아요를 누른 사용자 ULID */
  @Column({ name: 'user_uuid', type: 'varchar', length: 26 })
  userUuid: string;

  /** 좋아요가 눌린 게시글 ULID */
  @Column({ name: 'post_uuid', type: 'varchar', length: 26 })
  postUuid: string;

  /** 좋아요 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
