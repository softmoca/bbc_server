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

  async findAllComment(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = await this.commentRepository.find({
      where: { CommentPostIdx: id },
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
    id: number,
    updataCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const commnet = await this.commentRepository.findOne({
      where: { id },
    });

    const { commentContent } = updataCommentDto;

    commnet.commentContent = commentContent;

    return await this.commentRepository.save(commnet);
  }

  async deleteComment(id: number): Promise<Comment> {
    const commnet = await this.commentRepository.findOne({
      where: { id },
    });

    if (!commnet) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    await this.commentRepository.delete(id);
    return commnet;
  }
}
