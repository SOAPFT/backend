import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('image_verification')
export class ImageVerification {
  /** 검증 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 연관된 게시글 ULID */
  @Column({ name: 'post_uuid', type: 'varchar', length: 26 })
  postUuid: string;

  /** 이미지 URL */
  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl: string;

  /** AI 분석 결과 (관련성 여부) */
  @Column({ name: 'is_relevant', type: 'boolean' })
  isRelevant: boolean;

  /** AI 신뢰도 (0-100) */
  @Column({ name: 'confidence', type: 'decimal', precision: 5, scale: 2 })
  confidence: number;

  /** AI 분석 근거 */
  @Column({ name: 'reasoning', type: 'text' })
  reasoning: string;

  /** AI 권장 액션 */
  @Column({
    name: 'suggested_action',
    type: 'varchar',
    enum: ['approve', 'reject', 'review'],
  })
  suggestedAction: 'approve' | 'reject' | 'review';

  /** 검증 상태 */
  @Column({
    name: 'status',
    type: 'varchar',
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected' | 'review';

  /** 수동 검토자 UUID (관리자가 수동으로 검토한 경우) */
  @Column({
    name: 'reviewer_uuid',
    type: 'varchar',
    length: 26,
    nullable: true,
  })
  reviewerUuid: string;

  /** 수동 검토 의견 */
  @Column({ name: 'review_comment', type: 'text', nullable: true })
  reviewComment: string;

  /** 검증 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 검증 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
