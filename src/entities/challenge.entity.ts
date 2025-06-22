import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChallengeType, GenderType } from '@/types/challenge.enum';

@Entity('challenge')
export class Challenge {
  /** 챌린지 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'challenge_uuid', type: 'varchar', length: 26, unique: true })
  challengeUuid: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ChallengeType,
  })
  type: ChallengeType;

  /** 챌린지 전용 프로필 이미지 */
  @Column({ name: 'profile', type: 'varchar', nullable: true })
  profile: string;

  /** 챌린지 전용 배너 이미지 */
  @Column({ name: 'banner', type: 'varchar', nullable: true })
  banner: string;

  /** 챌린지 소개글 */
  @Column({ name: 'introduce', type: 'text' })
  introduce: string;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date;

  /** 주당 인증 목표 횟수 */
  @Column({ name: 'goal', type: 'int' })
  goal: number;

  /** 참여 가능 최소 연령 */
  @Column({ name: 'start_age', type: 'int' })
  startAge: number;

  /** 참여 가능 최대 연령 */
  @Column({ name: 'end_age', type: 'int', nullable: true })
  endAge: number;

  /** 성별 제한 (NONE: 제한없음, MALE: 남성만, FEMALE: 여성만) */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: GenderType,
  })
  gender: GenderType;

  /** 최대 참여자 수 */
  @Column({ name: 'max_member', type: 'int' })
  maxMember: number;

  /** 챌린지 생성자 ULID */
  @Column({ name: 'creator_uuid', type: 'varchar', length: 26 })
  creatorUuid: string;

  /** 참여자 ULID 배열 */
  @Column({ name: 'participant_uuid', type: 'varchar', array: true })
  participantUuid: string[];

  /** 참여 시 필요한 코인 양 */
  @Column({ name: 'coin_amount', type: 'int' })
  coinAmount: number;

  /** 챌린지 시작 여부 */
  @Column({ name: 'is_started', type: 'boolean' })
  isStarted: boolean;

  /** 챌린지 종료 여부 */
  @Column({ name: 'is_finished', type: 'boolean' })
  isFinished: boolean;

  /** 챌린지 성공한 참여자 ULID 배열 */
  @Column({ name: 'success_participants_uuid', type: 'varchar', array: true })
  successParticipantsUuid: string[];

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
