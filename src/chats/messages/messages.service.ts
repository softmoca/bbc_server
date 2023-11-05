import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../../common/common.service';

import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { Messages } from 'src/entities/messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessageDto, authorId: number) {
    const message = await this.messageRepository.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: authorId,
      },
      message: dto.message,
    });

    return this.messageRepository.findOne({
      where: {
        id: message.id,
      },
      relations: ['chat'],
    });
  }

  paginateMessage(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<Messages> = {},
  ) {
    return this.commonService.paginate(
      dto,
      this.messageRepository,

      overrideFindOptions,

      'message',
    );
  }
}
