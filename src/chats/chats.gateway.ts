import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chats', //ws:localhost:3000/chats
})
export class ChatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connet called : ${socket.id}`);
  }

  @SubscribeMessage('enter_chat')
  enterChat(@MessageBody() data: number[], @ConnectedSocket() socket: Socket) {
    for (const chatId of data) {
      socket.join(chatId.toString());
    }
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() message: { message: string; chatId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server
      .to(message.chatId.toString())
      .emit('receive_message', '서버로 부터온 메세지');
  }
}
