import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../../common/common.service';

import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { Messages } from 'src/entities/messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    private readonly commonService: CommonService,
  ) {}

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
