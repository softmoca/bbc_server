import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(exception, host);

    const socket = host.switchToWs().getClient();

    socket.emit('exceptoin', {
      data: exception.getResponse(),
    });
  }
}
