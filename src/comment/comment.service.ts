import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAllComment(postIdx: number) {
    const post = await this.postRepository.findOne({ where: { postIdx } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postIdx} not found`);
    }
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { CommentPostIdx, commentContent } = createCommentDto;
    const comment = new Comment();

    comment.commentContent = commentContent;
    comment.CommentPostIdx = CommentPostIdx;

    return await this.commentRepository.save(comment);
  }
}
