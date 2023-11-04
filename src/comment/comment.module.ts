import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post]), CommonModule],
  controllers: [CommentController],
  providers: [CommentService, CommentService],
})
export class CommentModule {}
