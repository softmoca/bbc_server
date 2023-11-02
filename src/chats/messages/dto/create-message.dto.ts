import { PickType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { Messages } from 'src/entities/messages.entity';

export class CreateMessageDto extends PickType(Messages, ['message']) {
  @IsNumber()
  chatId: number;

  @IsNumber()
  authorId;
}
