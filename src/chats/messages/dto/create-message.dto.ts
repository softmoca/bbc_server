import { PickType } from '@nestjs/mapped-types';
import { Messages } from 'src/entities/messages.entity';

export class CreateMessageDto extends PickType(Messages, ['message']) {}
