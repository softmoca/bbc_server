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

  @Get('/dormitory')
  getDormitoryPost() {
    return this.postService.getDormitoryPost();
  }

  @Get('/bima')
  getBimaPost() {
    return this.postService.getBimaPost();
  }

  @Get('/bokji')
  getBokjiPost() {
    return this.postService.getBokjiPost();
  }

  @Get('/centerLibrary')
  getCenterLibraryPost() {
    return this.postService.getCenterLibraryPost();
  }

  @Get('/chambit')
  getChambitPost() {
    return this.postService.getChambitPost();
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
  async updatePost(
    @Param('postIdx') postIdx: number,
    @Body() updataPostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(postIdx, updataPostDto);
  }

  @Delete(':postIdx')
  async deletePost(@Param('postIdx') postIdx: number) {
    return await this.postService.deletePost(postIdx);
  }
}
