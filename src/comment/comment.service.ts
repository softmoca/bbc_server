import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { PaginatePostDto } from 'src/post/dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/entities/User';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly commonService: CommonService,
  ) {}
  async paginateComments(dto: PaginatePostDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentRepository,
      { relations: { author: true } },
      `posts/${postId}/comments`,
    );
  }

  async findAllComment(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = await this.commentRepository.find({
      where: { id },
    });

    return comment;
  }

  async getCommentById(id: number) {
    const commnet = await this.commentRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });

    console.log('commnet');
    if (!commnet) {
      throw new BadRequestException(`id : ${id} comment는 존재 하지 않습니다/`);
    }
    return commnet;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: number,
    author: User,
  ): Promise<Comment> {
    return await this.commentRepository.save({
      ...createCommentDto,
      post: { id: postId },
      author,
    });
  }
}
