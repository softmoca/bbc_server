import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Comment } from 'src/entities/Comment';

export class CreateCommentDto extends PickType(Comment, [
  'CommentPostIdx',
  'commentContent',
]) {
  CommentPostIdx: number;

  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  commentContent: string;
}
