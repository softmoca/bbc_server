import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  postTitle: string;
  @IsNotEmpty()
  postContent: string;
  @IsNotEmpty()
  buildingName: string;
  @IsNotEmpty()
  chatRoomTitle: string;
}
