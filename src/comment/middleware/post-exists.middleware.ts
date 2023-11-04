import { PostService } from './../../post/post.service';
import { Request, Response, NextFunction } from 'express';
import {
  Injectable,
  NestMiddleware,
  Logger,
  BadGatewayException,
} from '@nestjs/common';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const postId = request.params.postId;

    if (!postId) {
      throw new BadGatewayException('PostId 파라미터를 입력해주세요');
    }

    const exists = await this.postService.checkPostExistsById(parseInt(postId));

    if (!exists) {
      throw new BadGatewayException('포스트가 존재 하지 않습니다./');
    }

    next();
  }
}
