import { IsEmail, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User', { schema: 'bbc_database' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userIdx' })
  userIdx: number;

  @Length(1, 30)
  @IsEmail()
  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Length(1, 30)
  @Column('varchar', { name: 'password', length: 300 })
  password: string;

  @Length(1, 30)
  @Column('varchar', { name: 'nickName', length: 30 })
  nickName: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
