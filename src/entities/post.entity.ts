import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post')
export class Post {
  /** 게시글 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 게시글 ULID */
  @Column({ name: 'post_uuid', type: 'varchar', length: 26, unique: true })
  postUuid: string;

  /** 게시글 제목 */
  @Column({ name: 'title', type: 'varchar', nullable: true })
  title: string;

  /** 작성자 ULID */
  @Column({ name: 'user_uuid', type: 'varchar', length: 26 })
  userUuid: string;

  /** 연동된 챌린지 ULID (인증글인 경우) */
  @Column({
    name: 'challenge_uuid',
    type: 'varchar',
    length: 26,
    nullable: true,
  })
  challengeUuid: string;

  /** 게시글 내용 */
  @Column({ name: 'content', type: 'varchar', nullable: true })
  content: string;

  /** 첨부 이미지 URL 배열 */
  @Column({ name: 'image_url', type: 'simple-array' })
  imageUrl: string[];

  /** 공개/비공개 설정 */
  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'views', type: 'int', default: 0 })
  views: number;

  /** AI 검증 상태 (pending: 대기중, approved: 승인, rejected: 거절, review: 수동검토필요) */
  @Column({
    name: 'verification_status',
    type: 'varchar',
    default: 'pending',
    nullable: true,
  })
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'review';

  /** AI 분석 신뢰도 (0-100) */
  @Column({
    name: 'ai_confidence',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  aiConfidence: number;

  /** AI 분석 결과 상세 */
  @Column({ name: 'ai_analysis_result', type: 'text', nullable: true })
  aiAnalysisResult: string;

  /** AI 검증 완료 일시 */
  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date;

  /** 게시글 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 게시글 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
