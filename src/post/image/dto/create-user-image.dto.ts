import { PickType } from '@nestjs/mapped-types';

import { Image } from 'src/entities/Image';

export class CreateUserImageDto extends PickType(Image, [
  'path',
  'user',
  'order',
  'type',
]) {}
