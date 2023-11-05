import { IsEmail, Length } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from './base.entity';
import { Chats } from './chats.entity';
import { Messages } from './messages.entity';
import { Exclude } from 'class-transformer';
import { Comment } from './Comment';
import { Post } from './Post';

@Entity('User', { schema: 'bbc_database' })
export class User extends BaseModel {
  @Length(1, 30)
  @IsEmail()
  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Length(1, 30)
  @Column('varchar', { name: 'password', length: 300 })
  password: string;

  @Length(1, 30)
  @Column('varchar', { name: 'nickName', length: 30 })
  nickName: string;

  @Length(1, 30)
  @Column('varchar', { name: 'university', length: 30, nullable: true })
  university: string | null;

  @Column('decimal', {
    name: 'longitude',
    nullable: true,
    precision: 10,
    scale: 7,
  })
  longitude: string | null;

  @Column('decimal', {
    name: 'latitude',
    nullable: true,
    precision: 10,
    scale: 7,
  })
  latitude: string | null;

  @Column('text', { name: 'profileImage', nullable: true })
  profileImage: string | null;

  @ManyToMany(() => Chats, (chat) => chat.users)
  @JoinTable()
  chats: Chats[];

  @OneToMany(() => Messages, (message) => message.author, { cascade: true })
  messages: Messages[];

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  postComments: Comment[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
