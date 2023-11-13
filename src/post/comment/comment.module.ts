import { PostModule } from '../post.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
import { CommonModule } from 'src/common/common.module';
import { PostExistsMiddleware } from './middleware/post-exists.middleware';
import { PostService } from 'src/post/post.service';

import { Image } from 'src/entities/Image';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, Image]),
    CommonModule,
    PostModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentService, PostService],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostExistsMiddleware).forRoutes(CommentController);
  }
}
