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
import { PostService } from './post.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('post')
@UseInterceptors(SuccessInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get(':postIdx')
  getOnePost(@Param('postIdx') postIdx: number) {
    return this.postService.getOnePost(postIdx);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Patch(':postIdx')
  async update(
    @Param('postIdx') postIdx: number,
    @Body() updataPostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(postIdx, updataPostDto);
  }

  @Delete(':postIdx')
  async delete(@Param('postIdx') postIdx: number) {
    console.log('sd');
    return await this.postService.delete(postIdx);
  }
}
