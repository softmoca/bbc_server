import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Post } from 'src/entities/Post';

export class CreatePostDto extends PickType(Post, [
  'postTitle',
  'postContent',
  'chatRoomTitle',
  'board',
]) {
  @IsString({ each: true })
  @IsOptional()
  images?: string[] = [];

  @IsOptional()
  boardId;
}
