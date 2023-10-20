import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Comment } from 'src/entities/Comment';

export class UpdateCommentDto extends PickType(Comment, ['commentContent']) {
  @IsNotEmpty()
  commentContent: string;
}
