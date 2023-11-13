import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from './base.entity';
import { Length } from 'class-validator';
import { Post } from './Post';

@Entity('Board', { schema: 'bbc_database' })
export class Board extends BaseModel {
  @Length(1, 30)
  @Column()
  BoardTitle: string;

  @OneToMany(() => Post, (post) => post.board, { cascade: true })
  posts: Post[];
}
