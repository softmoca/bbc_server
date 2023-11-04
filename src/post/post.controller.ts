import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from 'src/entities/Image';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostImageService } from './image/image.service';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QueryRunner } from 'src/common/decorators/query-runner.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/User';

@Controller('post')
@UseInterceptors(SuccessInterceptor)
export class PostController {
  constructor(
    private postService: PostService,
    private readonly postImageService: PostImageService,
    private readonly dataSource: DataSource,
  ) {}

  // @Get()
  // getAllPost() {
  //   return this.postService.getAllPost();
  // }

  // @Post('random')
  // @UseGuards(JwtAuthGuard)
  // async postPostsRandom(@CurrentUser() user: User) {
  //   await this.postService.generatePosts(user.id);

  //   return true;
  // }

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
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @QueryRunner() qr: QR,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    console.log(userId);
    const post = await this.postService.createPost(createPostDto, qr, userId);
    //throw new InternalServerErrorException('일부러넣은 에러');

    for (let i = 0; i < createPostDto.images.length; i++) {
      await this.postImageService.createPostImage(
        {
          post,
          path: createPostDto.images[i],
          order: i,
          type: ImageModelType.postImage,
        },
        qr,
      );
    }

    return this.postService.getOnePost(post.id, qr);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() updataPostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    const ee = await this.postService.isPostMine(userId, id);

    console.log(ee);
    return await this.postService.updatePost(id, updataPostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return await this.postService.deletePost(id);
  }
}
