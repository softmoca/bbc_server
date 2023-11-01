import { PickType } from '@nestjs/mapped-types';

import { Image } from 'src/entities/Image';

export class CreatePostImageDto extends PickType(Image, [
  'path',
  'post',
  'order',
  'type',
]) {}
