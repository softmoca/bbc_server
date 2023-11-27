import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from './base.entity';
import { Chats } from './chats.entity';
import { Messages } from './messages.entity';
import { Exclude } from 'class-transformer';
import { Comment } from './Comment';
import { Post } from './Post';
import { Image } from './Image';

@Entity('User', { schema: 'bbc_database' })
export class User extends BaseModel {
  @IsEmail({}, { message: '이메일 형식으로 입력 해주세요 !' })
  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Length(1, 30)
  @Column('varchar', { name: 'password', length: 300 })
  password: string;

  @IsNotEmpty({ message: '문자을 입력 하세요 !' })
  @IsString({ message: '문자을 입력 하세요 !' })
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

  @ManyToMany(() => Chats, (chat) => chat.users, { cascade: true })
  @JoinTable()
  chats: Chats[];

  @OneToMany(() => Messages, (message) => message.author, { cascade: true })
  messages: Messages[];

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  postComments: Comment[];

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];

  @IsNotEmpty()
  @OneToMany((type) => Image, (image) => image.user, { cascade: true })
  images: Image[];
}
