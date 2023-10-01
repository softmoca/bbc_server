import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Comment', { schema: 'bbc_database' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'postIdx' })
  commentIdx: number;

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
}
