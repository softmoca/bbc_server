import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment';
import { BaseModel } from './base.entity';
import { Length } from 'class-validator';

@Entity('Post', { schema: 'bbc_database' })
export class Post extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'postIdx' })
  postIdx: number;

  @Length(1, 30)
  @Column('varchar', { name: 'postTitle', length: 30 })
  postTitle: string;

  @Length(1, 300)
  @Column('varchar', { name: 'postContent', length: 300 })
  postContent: string;

  @Column('boolean', { name: 'postAnonymous', default: true })
  postAnonymous: boolean;

  @Column('text', { name: 'postImage', nullable: true })
  postImage: string;

  @Column('int', { name: 'postLike', default: 0 })
  postLike: number;

  @Column('varchar', { name: 'buildingName', nullable: true, length: 20 })
  buildingName: string | null;

  @Length(1, 20)
  @Column('varchar', { name: 'chatRoomTitle', length: 20 })
  chatRoomTitle: string;

  @OneToMany(() => Comment, (comments) => comments.Post)
  Comments: Comment[];
}
