import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  postTitle: string;

  @MinLength(1)
  @MaxLength(200)
  @IsNotEmpty()
  postContent: string;

  @IsNotEmpty()
  buildingName: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  chatRoomTitle: string;
}
