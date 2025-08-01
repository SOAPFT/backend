import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type MissionType = 'distance' | 'steps' | 'heart';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['distance', 'steps', 'heart'] })
  type: MissionType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  durationSeconds: number;

  @Column({ type: 'int', default: 0 })
  reward: number;

  @CreateDateColumn()
  createdAt: Date;
}
