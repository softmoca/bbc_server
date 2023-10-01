import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';

@Entity('Comment', { schema: 'bbc_database' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'commentIdx' })
  commentIdx: number;

  @Column('int', { name: 'CommentPostIdx', nullable: true })
  CommentPostIdx: number | null;

  @Column('varchar', { name: 'comment', length: 100 })
  commentContent: string;

  @Column('boolean', { name: 'commentAnonymous', default: true })
  commentAnonymous: boolean;

  @Column('int', { name: 'commentLike', default: 0 })
  commentLike: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.Comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'CommentPostIdx', referencedColumnName: 'postIdx' }])
  Post: Post;
}
