import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Post', { schema: 'bbc_database' })
export class Post {
  @PrimaryColumn({ type: 'int', name: 'postIdx' })
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

  @Column('varchar', { name: 'buildingName', length: 20 })
  buildingName: string;

  @Column('varchar', { name: 'chatRoomTitle', length: 20 })
  chatRoomTitle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
