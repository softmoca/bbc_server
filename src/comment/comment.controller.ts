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

  @Get('/:id')
  findAllComment(@Param('id') id: number) {
    return this.commentService.findAllComment(id);
  }

  @Post()
  async createComment(@Body() createPostDto: CreateCommentDto) {
    return this.commentService.createComment(createPostDto);
  }

  @Patch(':id')
  async updateComment(
    @Param('id') id: number,
    @Body() updataCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.updateComment(id, updataCommentDto);
  }

  @Delete(':id')
  async deleteCommnet(@Param('commentIdx') commentIdx: number) {
    return await this.commentService.deleteComment(commentIdx);
  }
}
