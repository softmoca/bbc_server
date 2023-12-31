import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentService } from './comment.service';
import { PaginatePostDto } from 'src/post/dto/paginate-post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateCommentDto } from './dto/createComment.dto';
import { User } from 'src/entities/User';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { IsCommentMineGuard } from 'src/auth/guard/is-comment-mine.guard';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QueryRunner } from 'src/common/decorators/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { PostService } from 'src/post/post.service';
@Controller('/post/:postId/comment')
@UseInterceptors(SuccessInterceptor)
export class CommentController {
  constructor(
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  //댓글 최신순으로 가져오기
  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginatePostDto,
  ) {
    return this.commentService.paginateComments(query, postId);
  }

  //특정 댓글 가져오기
  @Get('/:commentId')
  getCommentById(@Param('commentId') commentId: number) {
    return this.commentService.getCommentById(commentId);
  }

  //댓글 만들기
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createPostDto: CreateCommentDto,
    @CurrentUser() user: User,
    @QueryRunner() qr: QR,
  ) {
    console.log('dfd');

    const newComment = await this.commentService.createComment(
      createPostDto,
      postId,
      user,
      qr,
    );

    await this.postService.incrementCommentCount(postId, qr);

    return newComment;
  }

  //댓글 수정하기
  @Patch(':cid')
  async patchComments(
    @Param('cid') cid: number,
    @Body() body: UpdateCommentDto,
  ) {
    const comment = await this.commentService.updateComment(body, cid);

    return comment;
  }

  //댓글 삭제하기
  @UseGuards(IsCommentMineGuard)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Param('postId') postId: number,
    @CurrentUser() user: User,
    @QueryRunner() qr: QR,
  ) {
    const resp = await this.commentService.deleteComment(commentId, qr);

    await this.postService.decrementCommentCount(postId, qr);
    return resp;
  }
}
