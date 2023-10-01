import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createPost(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { commentContent } = createCommentDto;
    const comment = new Comment();

    comment.commentContent = commentContent;

    return await this.commentRepository.save(comment);
  }
}
