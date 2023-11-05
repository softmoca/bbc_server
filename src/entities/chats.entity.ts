import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from './User';
import { BaseModel } from './base.entity';
import { Messages } from './messages.entity';

@Entity()
export class Chats extends BaseModel {
  @ManyToMany(() => User, (user) => user.chats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: User[];

  @OneToMany(() => Messages, (message) => message.chat, { cascade: true })
  messages: Messages;
}
