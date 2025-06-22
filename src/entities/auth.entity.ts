import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth')
export class Auth {
  /** 인증 정보 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 사용자 ULID */
  @Column({ name: 'user_uuid', type: 'varchar', length: 26 })
  userUuid: string;

  /** 리프레시 토큰 (JWT 토큰 갱신용) */
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string;

  /** 디바이스 식별자 (iOS UUID) */
  @Column({ name: 'device_id', type: 'varchar', nullable: true })
  deviceId: string;

  /** 디바이스 타입 (iOS, Android 등) */
  @Column({ name: 'device_type', type: 'varchar', nullable: true })
  deviceType: string;

  /** 앱 버전 */
  @Column({ name: 'app_version', type: 'varchar', nullable: true })
  appVersion: string;

  /** 마지막 로그인 일시 */
  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  /** 토큰 만료 일시 */
  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date;

  /** 활성화 상태 */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /** 인증 정보 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 인증 정보 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
