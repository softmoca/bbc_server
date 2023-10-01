import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
import { UpdateCommentDto } from './dto/updateComment.dto';

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
      throw new NotFoundException(`Comment with ID ${postIdx} not found`);
    }

    const comment = await this.commentRepository.find({
      where: { CommentPostIdx: postIdx },
    });

    return comment;
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { CommentPostIdx, commentContent } = createCommentDto;
    const comment = new Comment();

    comment.commentContent = commentContent;
    comment.CommentPostIdx = CommentPostIdx;

    return await this.commentRepository.save(comment);
  }

  async updateComment(
    commentIdx: number,
    updataCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const commnet = await this.commentRepository.findOne({
      where: { commentIdx },
    });

    const { commentContent } = updataCommentDto;

    commnet.commentContent = commentContent;

    return await this.commentRepository.save(commnet);
  }

  async deleteComment(commentIdx: number): Promise<Comment> {
    const commnet = await this.commentRepository.findOne({
      where: { commentIdx },
    });

    if (!commnet) {
      throw new NotFoundException(`Comment with ID ${commentIdx} not found`);
    }
    await this.commentRepository.delete(commentIdx);
    return commnet;
  }
}
