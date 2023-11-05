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

@Controller('/post/:postId/comment')
@UseInterceptors(SuccessInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginatePostDto,
  ) {
    return this.commentService.paginateComments(query, postId);
  }

  @Get('/:commentId')
  getCommentById(@Param('commentId') commentId: number) {
    return this.commentService.getCommentById(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createPostDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.createComment(createPostDto, postId, user);
  }

  @Patch(':cid')
  async patchComments(
    @Param('cid') cid: number,
    @Body() body: UpdateCommentDto,
  ) {
    const comment = await this.commentService.updateComment(body, cid);

    return comment;
  }

  @UseGuards(IsCommentMineGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') cid: number,

    @CurrentUser() user: User,
  ) {
    return await this.commentService.deleteComment(cid);
  }
}
