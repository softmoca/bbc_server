import { PickType } from '@nestjs/swagger';

import { Comment } from 'src/entities/Comment';

export class CreateCommentDto extends PickType(Comment, [
  'CommentPostIdx',
  'commentContent',
]) {}
