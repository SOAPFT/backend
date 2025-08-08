import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  accountNumber: string;

  @Column('int')
  amount: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;
}
