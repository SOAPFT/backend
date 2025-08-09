// src/entities/payment.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column({ nullable: true })
  orderId: string;

  @Column('int')
  amount: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILURE';

  @CreateDateColumn()
  createdAt: Date;
}
