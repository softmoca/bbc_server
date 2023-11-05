import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';
import { BaseModel } from './base.entity';
import { IsNumber, IsString, Length } from 'class-validator';
import { User } from './User';

@Entity('Comment', { schema: 'bbc_database' })
export class Comment extends BaseModel {
  @ManyToOne(() => User, (user) => user.postComments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Length(1, 100)
  @IsString()
  @Column('varchar', { name: 'comment', length: 100 })
  commentContent: string;

  @Column('boolean', { name: 'commentAnonymous', default: true })
  commentAnonymous: boolean;

  @IsNumber()
  @Column('int', { name: 'commentLike', default: 0 })
  commentLike: number;
}
