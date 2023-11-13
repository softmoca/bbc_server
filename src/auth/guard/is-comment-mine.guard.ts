import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { CommentService } from 'src/post/comment/comment.service';
import { User } from 'src/entities/User';

@Injectable()
export class IsCommentMineGuard implements CanActivate {
  constructor(private readonly commentService: CommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & { user: User };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    const commentId = req.params.commentId;

    if (!commentId) {
      throw new BadRequestException('Comment ID가 파라미터로 제공돼야합니다.');
    }

    console.log(user.id, commentId);
    const isOk = await this.commentService.isCommentMine(
      user.id,
      parseInt(commentId),
    );

    if (!isOk) {
      throw new ForbiddenException('자신의 댓글만 수정 삭제할 수 있습니다.');
    }

    return true;
  }
}
