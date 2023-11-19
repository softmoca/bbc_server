import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { User } from 'src/entities/User';

export class UpdateUserDto {
  @IsString({ each: true })
  @IsOptional()
  nickName: string = '';

  @IsString({ each: true })
  @IsOptional()
  images?: string[] = [];
}
