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
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chats, Messages]),
    CommonModule,
    AuthModule,
    UserModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, ChatsGateway, MessagesService],
})
export class ChatsModule {}
