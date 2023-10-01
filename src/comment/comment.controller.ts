import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comment')
@UseInterceptors(SuccessInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('/:postIdx')
  findAllComment(@Param('postIdx') postIdx: number) {
    return this.commentService.findAllComment(postIdx);
  }

  @Post()
  async createComment(@Body() createPostDto: CreateCommentDto) {
    return this.commentService.createComment(createPostDto);
  }

  @Patch(':commentIdx')
  async updateComment(
    @Param('commentIdx') commentIdx: number,
    @Body() updataCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.updateComment(
      commentIdx,
      updataCommentDto,
    );
  }

  @Delete(':commentIdx')
  async deleteCommnet(@Param('commentIdx') commentIdx: number) {
    return await this.commentService.deleteComment(commentIdx);
  }
}
