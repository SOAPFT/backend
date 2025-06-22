import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
export class Comment {
  /** 댓글 고유 ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /** 댓글 작성자 ULID */
  @Column({ name: 'user_uuid', type: 'varchar', length: 26 })
  userUuid: string;

  /** 댓글이 달린 게시글 ULID */
  @Column({ name: 'post_uuid', type: 'varchar', length: 26 })
  postUuid: string;

  /** 부모 댓글 ID (대댓글인 경우, null이면 최상위 댓글) */
  @Column({ name: 'parent_comment_id', type: 'int', nullable: true })
  parentCommentId: number;

  /** 댓글 내용 */
  @Column({ name: 'content', type: 'varchar' })
  content: string;

  /** 언급된 사용자 닉네임 배열 (@user 형태) */
  @Column({
    name: 'mentioned_users',
    type: 'varchar',
    array: true,
    default: '{}',
  })
  mentionedUsers: string[];

  /** 댓글 생성일시 */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  /** 댓글 수정일시 */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
