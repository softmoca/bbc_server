import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User', { schema: 'bbc_database' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userIdx' })
  userIdx: number;

  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Column('varchar', { name: 'password', length: 30 })
  password: string;

  @Column('varchar', { name: 'nickName', length: 30 })
  nickName: string;

  @Column('varchar', { name: 'university', length: 30 })
  university: string;

  @Column('varchar', { name: 'phone', length: 11 })
  phone: string;

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

  @Column('datetime', { name: 'createdAt' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt' })
  updatedAt: Date;
}
