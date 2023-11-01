import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';

import { CommonModule } from 'src/common/common.module';
import { Image } from 'src/entities/Image';
import { PostImageService } from './image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image]), CommonModule],
  controllers: [PostController],
  providers: [PostService, PostImageService],
})
export class PostModule {}
