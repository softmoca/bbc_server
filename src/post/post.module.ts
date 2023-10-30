import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { MulterModule } from '@nestjs/platform-express';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    TypeOrmModule.forFeature([Post]),
    CommonModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
