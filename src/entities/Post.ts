import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from './Comment';
import { BaseModel } from './base.entity';
import { Length } from 'class-validator';
import { Image } from './Image';
import { User } from './User';
import { Board } from './Board.entity';

@Entity('Post', { schema: 'bbc_database' })
export class Post extends BaseModel {
  @Length(1, 30)
  @Column('varchar', { name: 'postTitle', length: 30 })
  postTitle: string;

  @Length(1, 300)
  @Column('varchar', { name: 'postContent', length: 300 })
  postContent: string;

  @Column('int', { name: 'postLike', default: 0 })
  postLike: number;

  @Length(1, 20)
  @Column('varchar', { name: 'chatRoomTitle', length: 20 })
  chatRoomTitle: string;

  @OneToMany((type) => Image, (image) => image.post, { cascade: true })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  author: User;

  @Column({ default: 0 })
  commentCount: number;

  @ManyToOne(() => Board, (board) => board.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  board: Board;
}
