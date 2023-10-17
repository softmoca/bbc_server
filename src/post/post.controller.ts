import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

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

  @UseInterceptors(FilesInterceptor('files', 10, multerOptions('postImage')))
  @Post('image')
  uploadImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);

    return {
      image: `http://localhost:3030/media/postImage/${files[0].filename}`,
    };
  }
}
