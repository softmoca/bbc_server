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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from 'src/entities/Image';
import { DataSource, QueryRunner as QR } from 'typeorm';

import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QueryRunner } from 'src/common/decorators/query-runner.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/User';
import { IsPostMineGuard } from 'src/auth/guard/is-post-mine.guard';
import { PostImageService } from './image/image.service';

@Controller('post')
@UseInterceptors(SuccessInterceptor)
export class PostController {
  constructor(
    private postService: PostService,
    private readonly postImageService: PostImageService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('random')
  @UseGuards(JwtAuthGuard)
  async postPostsRandom(@CurrentUser() user: User) {
    const userId = user.id;
    await this.postService.generatePosts(userId);

    return true;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getPost(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
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
    const post = await this.postService.createPost(createPostDto, userId, qr);

    console.log(createPostDto.images);

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

  @UseGuards(IsPostMineGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  async updatePost(
    @Param('postId') id: number,
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
}
