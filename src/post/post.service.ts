import { DEFAULT_POST_FIND_OPTIONS } from './../common/const/default-post-find-option.const';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import {
  FindOptionsWhere,
  LessThan,
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.const';
import { CommonService } from 'src/common/common.service';

import { Image } from 'src/entities/Image';
import { Board } from 'src/entities/Board.entity';
import { PaginateBoardPostDto } from './dto/paginate-board.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly commonService: CommonService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postRepository,
      { ...DEFAULT_POST_FIND_OPTIONS },
      'post',
    );
  }

  async getBoardPost(dto: PaginateBoardPostDto) {
    return this.commonService.paginate(
      dto,
      this.postRepository,
      { ...DEFAULT_POST_FIND_OPTIONS },
      'post/getBoardPost',
    );
  }

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<Post>(Post) : this.postRepository;
  }

  async generatePosts(userId: number, boardId) {
    const bolardIID: number = parseInt(boardId.boardId);

    console.log(bolardIID);
    // const post = await this.postRepository.findOne({
    //   where: { board: { id: bolardIID } },
    // });

    //const buildingName = post.buildingName;

    for (let i = 0; i < 5; i++) {
      await this.createPost(
        {
          postTitle: `임의로 생성된 포스트 제목 ${i}`,
          postContent: `임의로 생성된 포스트 내용 ${i}`,
          chatRoomTitle: `임의로 생성된 채팅방 이름 ${i}`,
          images: [],
          board: {
            id: boardId,
            BoardTitle: '',
            posts: [],
            updatedAt: undefined,
            createdAt: undefined,
          },
          boardId: undefined,
        },
        userId,
      );
    }
  }
  async getOnePost(id: number, qr?: QueryRunner): Promise<Post> {
    const repository = this.getRepository(qr);

    const post = await repository.findOne({
      where: { id },
      relations: ['images', 'author', 'board', 'author.images'],
    });

    console.log('d');
    post.author.images = post.author.images.filter(
      (image) => image.user?.id === post.author.id,
    );

    const authorProfilePath =
      post?.author?.images[post?.author?.images?.length - 1]?.path;

    post['authorProfilePath'] = authorProfilePath;

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId?: number,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    const boardId = createPostDto.boardId;

    const post = repository.create({
      author: {
        id: userId,
      },
      ...createPostDto,
      images: [],
      board: {
        id: boardId,
      },
    });

    const newPost = await repository.save(post);

    return newPost;
  }

  async updatePost(id: number, updataPostDto: UpdatePostDto): Promise<Post> {
    const post = await this.getOnePost(id);
    const { postTitle, postContent, chatRoomTitle } = updataPostDto;

    post.postTitle = postTitle;
    post.postContent = postContent;
    post.chatRoomTitle = chatRoomTitle;

    return await this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    await this.postRepository.delete(id);
    return post;
  }

  async checkPostExistsById(id: number) {
    return this.postRepository.exist({
      where: {
        id,
      },
    });
  }

  async isPostMine(userId: number, postId: number) {
    return this.postRepository.exist({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }

  async incrementCommentCount(PostId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.increment(
      {
        id: PostId,
      },
      'commentCount',
      1,
    );
  }

  async decrementCommentCount(PostId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.decrement(
      {
        id: PostId,
      },
      'commentCount',
      1,
    );
  }
}
