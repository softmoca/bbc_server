import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { MessagesService } from './messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exceptions/socket-catch-http.exception-filter';

import { User } from 'src/entities/User';
import { SocketBearerTokenGuard } from 'src/auth/guard/socket-bearer-token.guard';

@WebSocketGateway({
  namespace: 'chats', //ws:localhost:3000/chats
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connet called : ${socket.id}`);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: User },
  ) {
    console.log('df');
    const chat = await this.chatsService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException(
          `존재하지 않는 채팅방입니다. Chat ID : ${chatId}`,
        );
      }
    }

    socket.join(data.chatIds.map((x) => x.toString()));
  }
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`,
      );
    }

    const message = await this.messagesService.createMessage(dto);

    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
  }
}
