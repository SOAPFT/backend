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

  @CreateDateColumn()
  createdAt: Date;
}
