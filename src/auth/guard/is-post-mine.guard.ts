import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { User } from 'src/entities/User';
import { PostService } from 'src/post/post.service';

@Injectable()
export class IsPostMineGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & { user: User };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('Post ID가 파라미터로 제공돼야합니다.');
    }

    const isOk = await this.postService.isPostMine(user.id, parseInt(postId));

    if (!isOk) {
      throw new ForbiddenException(
        ' 자신의 게시글만 수정삭제 할  수 있습니다. ',
      );
    }

    return true;
  }
}
