import { DEFAULT_COMMENT_FIND_OPTIONS } from './../common/const/default-comment-find-option.const';
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
      { ...DEFAULT_COMMENT_FIND_OPTIONS },
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
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id,
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
    qr?: QueryRunner,
  ): Promise<Comment> {
    const repository = this.getRepository(qr);

    return repository.save({
      ...createCommentDto,
      post: { id: postId },
      author,
    });
  }

  async updateComment(dto: UpdateCommentDto, commentId: number) {
    const comment = await this.commentRepository.preload({
      id: commentId,
      ...dto,
    });

    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async deleteComment(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const commnet = await repository.findOne({
      where: { id },
    });

    if (!commnet) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    await repository.delete(id);

    return id;
  }

  async isCommentMine(userId: number, commentId: number) {
    return this.commentRepository.exist({
      where: {
        id: commentId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<Comment>(Comment)
      : this.commentRepository;
  }
}
