import { Comment } from 'src/entities/Comment';

import { FindManyOptions } from 'typeorm';

export const DEFAULT_COMMENT_FIND_OPTIONS: FindManyOptions<Comment> = {
  relations: {
    author: true,
  },
};
