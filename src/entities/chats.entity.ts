import { Entity, ManyToMany } from 'typeorm';
import { User } from './User';
import { BaseModel } from './base.entity';

@Entity()
export class Chats extends BaseModel {
  @ManyToMany(() => User, (user) => user.chats)
  users: User[];
}
