import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';

@Entity('Post', { schema: 'bbc_database' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'postIdx' })
  postIdx: number;

  @Column('varchar', { name: 'postTitle', length: 30 })
  postTitle: string;

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

  @Column('varchar', { name: 'chatRoomTitle', length: 20 })
  chatRoomTitle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comments) => comments.Post)
  Comments: Comment[];
}
