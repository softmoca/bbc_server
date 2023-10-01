import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
@UseInterceptors(SuccessInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  async createComment(@Body() createPostDto: CreateCommentDto) {
    return this.commentService.createComment(createPostDto);
  }
}
