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
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { PaginatePostDto } from 'src/post/dto/paginate-post.dto';

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
  findAllComment(@Param('commentId') commentId: number) {
    return this.commentService.getCommentById(commentId);
  }

  @Post()
  async createComment(@Body() createPostDto: CreateCommentDto) {
    return this.commentService.createComment(createPostDto);
  }
}
