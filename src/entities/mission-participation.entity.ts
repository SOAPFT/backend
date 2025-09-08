import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MissionParticipation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  missionId: number;

  @Column({ type: 'timestamp' })
  joinedAt: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'double precision', nullable: true })
  resultData: number;

  // 보상 지급 여부
  @Column({ default: false })
  rewarded: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
