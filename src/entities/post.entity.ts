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

  /** 게시글 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 게시글 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
