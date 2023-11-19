import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { User } from 'src/entities/User';

export class UpdateUserDto extends PickType(User, ['nickName']) {
  @IsString({ each: true })
  @IsOptional()
  images?: string[] = [];
}
