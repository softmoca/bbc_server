import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';
import { BaseModel } from './base.entity';
import { Length } from 'class-validator';

@Entity('Comment', { schema: 'bbc_database' })
export class Comment extends BaseModel {
  @Column('int', { name: 'CommentPostIdx', nullable: true })
  CommentPostIdx: number | null;

  @Length(1, 100)
  @Column('varchar', { name: 'comment', length: 100 })
  commentContent: string;

  @Column('boolean', { name: 'commentAnonymous', default: true })
  commentAnonymous: boolean;

  @Column('int', { name: 'commentLike', default: 0 })
  commentLike: number;

  @ManyToOne(() => Post, (post) => post.Comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'CommentPostIdx', referencedColumnName: 'id' }])
  Post: Post;
}
