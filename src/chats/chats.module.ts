import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from 'src/entities/chats.entity';
import { CommonModule } from 'src/common/common.module';
import { MessagesService } from './messages/messages.service';
import { Messages } from 'src/entities/messages.entity';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, Messages]), CommonModule],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, ChatsGateway, MessagesService],
})
export class ChatsModule {}
