import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class TestUser {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'user_uuid', type: 'varchar', length: 26, unique: true })
  userUuid: string;

  @Column({ name: 'nickname', type: 'varchar', unique: true, nullable: true })
  nickname: string;

  @Column({ name: 'socialNickname', type: 'varchar' })
  socialNickname: string;

  @Column({ name: 'profile_image', type: 'varchar', nullable: true })
  profileImage: string;

  // Convert enum to string for SQLite compatibility
  @Column({ name: 'social_provider', type: 'varchar', default: 'KAKAO' })
  socialProvider: string;

  @Column({ name: 'social_id', type: 'varchar', nullable: true })
  socialId: string;

  @Column({ name: 'introduction', type: 'varchar', nullable: true })
  introduction: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  // Convert enum to string for SQLite compatibility
  @Column({ name: 'gender', type: 'varchar', default: 'NONE' })
  gender: string;

  @Column({ name: 'coins', type: 'int', default: 0 })
  coins: number;

  @Column({ name: 'push_tokens', type: 'text', nullable: true })
  pushTokens: string;

  @Column({ name: 'push_token', type: 'varchar', nullable: true })
  pushToken: string;

  @Column({ name: 'is_push_enabled', type: 'boolean', default: true })
  isPushEnabled: boolean;

  // Convert enum to string for SQLite compatibility
  @Column({ name: 'status', type: 'varchar', default: 'INCOMPLETE' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
