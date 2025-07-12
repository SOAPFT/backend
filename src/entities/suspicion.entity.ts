import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('suspicion')
@Unique(['userUuid', 'postUuid']) // 한 유저가 같은 글에 중복 신고 못 하도록
export class Suspicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 26 })
  userUuid: string;

  @Column({ type: 'varchar', length: 26 })
  postUuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
