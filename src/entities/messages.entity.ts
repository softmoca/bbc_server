import { IsString } from 'class-validator';

import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import { Chats } from './chats.entity';
import { BaseModel } from './base.entity';

@Entity()
export class Messages extends BaseModel {
  @ManyToOne(() => Chats, (chat) => chat.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chat: Chats;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  author: User;

  @Column()
  @IsString()
  message: string;
}
