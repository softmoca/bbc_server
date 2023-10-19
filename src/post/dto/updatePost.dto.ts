import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  postTitle: string;

  @IsNotEmpty()
  postContent: string;

  @IsNotEmpty()
  buildingName: string;

  @IsNotEmpty()
  chatRoomTitle: string;
}
