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
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from 'src/common/exceptions/socket-catch-http.exception-filter';

import { User } from 'src/entities/User';
import { SocketBearerTokenGuard } from 'src/auth/guard/socket-bearer-token.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: 'chats', //ws:localhost:3000/chats
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket & { user: User }) {
    const headers = socket.handshake.headers;
    const rawToken = headers['authorization'];

    if (!rawToken) {
      socket.disconnect();
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = await this.authService.verifyToken(token);

      const user = await this.userService.getUserByEmail(payload.email);

      socket.user = user;
    } catch (e) {
      socket.disconnect();
    }

    //console.log(socket);
    return true;

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
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: User },
  ) {
    //console.log(socket);
    const chat = await this.chatsService.createChat(data);
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
  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: User },
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
    @ConnectedSocket() socket: Socket & { user: User },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`,
      );
    }

    const message = await this.messagesService.createMessage(
      dto,
      socket.user.id,
    );

    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
  }
}
