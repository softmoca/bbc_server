import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from 'src/entities/Image';

@Controller('post')
@UseInterceptors(SuccessInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  // @Get()
  // getAllPost() {
  //   return this.postService.getAllPost();
  // }

  @Post('random')
  async postPostsRandom() {
    await this.postService.generatePosts();

    return true;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getPost(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
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

  @Get('/theater')
  getTheaterPost() {
    return this.postService.getTheaterPost();
  }

  @Get('/hanul')
  getHanulPost() {
    return this.postService.getHanulPost();
  }

  @Get('/saebit')
  getSaebitPost() {
    return this.postService.getSaebitPost();
  }

  @Get('/hwado')
  getHwadoPost() {
    return this.postService.getHwadoPost();
  }

  @Get('/okui')
  getOkuiPost() {
    return this.postService.getOkuiPost();
  }

  @Get('/nuri')
  getNuriPost() {
    return this.postService.getNuriPost();
  }

  @Get(':id')
  getOnePost(@Param('id') id: number) {
    return this.postService.getOnePost(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);

    for (let i = 0; i < createPostDto.images.length; i++) {
      await this.postService.createPostImage({
        post,
        path: createPostDto.images[i],
        order: i,
        type: ImageModelType.postImage,
      });
    }

    return this.postService.getOnePost(post.id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() updataPostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(id, updataPostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return await this.postService.deletePost(id);
  }
}
