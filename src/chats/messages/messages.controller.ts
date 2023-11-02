import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

@Controller('chat/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  paginateMessage(
    @Param('cid', ParseIntPipe) id: number,
    dto: BasePaginationDto,
  ) {
    return this.messagesService.paginateMessage(dto, {
      where: {
        chat: {
          id,
        },
      },
    });
  }
}
