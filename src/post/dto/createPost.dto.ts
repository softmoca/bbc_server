import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Post } from 'src/entities/Post';

export class CreatePostDto extends PickType(Post, [
  'postTitle',
  'postContent',
  'buildingName',
  'chatRoomTitle',
]) {
  // @IsString()
  // @IsOptional()
  // postImage?: string;
}
