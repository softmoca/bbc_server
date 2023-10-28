import { PickType } from '@nestjs/swagger';

import { Comment } from 'src/entities/Comment';

export class UpdateCommentDto extends PickType(Comment, ['commentContent']) {}
