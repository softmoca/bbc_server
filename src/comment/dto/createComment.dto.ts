import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Comment } from 'src/entities/Comment';

export class CreateCommentDto extends PickType(Comment, [
  'CommentPostIdx',
  'commentContent',
]) {
  CommentPostIdx: number;

  @IsNotEmpty()
  commentContent: string;
}
