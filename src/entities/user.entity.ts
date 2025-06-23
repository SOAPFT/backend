import { SocialProvider } from '@/types/social-provider.enum';
import { UserStatusType } from '@/types/user-status.enum';
import { GenderType } from '@/types/challenge.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  /** 사용자 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 사용자 ULID */
  @Column({ name: 'user_uuid', type: 'varchar', length: 26, unique: true })
  userUuid: string;

  /** 사용자 설정 닉네임 (앱 내에서 사용) */
  @Column({ name: 'nickname', type: 'varchar', unique: true, nullable: true })
  nickname: string;

  /** 소셜 로그인에서 가져온 닉네임 */
  @Column({ name: 'socialNickname', type: 'varchar' })
  socialNickname: string;

  /** 프로필 이미지 URL */
  @Column({ name: 'profile_image', type: 'varchar', nullable: true })
  profileImage: string;

  /** 소셜 로그인 제공자 (KAKAO, NAVER, APPLE) */
  @Column({ name: 'social_provider', type: 'enum', enum: SocialProvider })
  socialProvider: SocialProvider;

  /** 소셜 로그인 제공자에서의 사용자 ID */
  @Column({ name: 'social_id', type: 'varchar', nullable: true })
  socialId: string;

  /** 사용자 자기소개 */
  @Column({ name: 'introduction', type: 'varchar', nullable: true })
  introduction: string;

  /** 사용자 연령 (챌린지 참여 조건 체크용) */
  @Column({ name: 'age', type: 'int', nullable: true })
  age: number;

  /** 사용자 성별 (챌린지 참여 조건 체크용) */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: GenderType,
    default: GenderType.NONE,
  })
  gender: GenderType;

  /** 보유 코인 수량 */
  @Column({ name: 'coins', type: 'int', default: 0 })
  coins: number;

  /** iOS 푸시 알림 토큰 */
  @Column({ name: 'push_token', type: 'varchar', nullable: true })
  pushToken: string;

  /** 푸시 알림 수신 동의 여부 */
  @Column({ name: 'is_push_enabled', type: 'boolean', default: true })
  isPushEnabled: boolean;

  /** 계정 상태 (활성, 비활성, 탈퇴 등) */
  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatusType,
    default: UserStatusType.INCOMPLETE,
  })
  status: UserStatusType;

  /** 계정 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 계정 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
