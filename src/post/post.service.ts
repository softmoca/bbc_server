import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from 'src/common/const/env.const';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postRepository.find({
      where: {
        id: MoreThan(dto.where__id__more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/post`);
    if (nextUrl) {
      /**
       * dto의 키값들을 루핑하면서
       * 키값에 해당되는 벨류가 존재하면
       * param에 그대로 붙여넣는다.
       *
       * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id,
      },
      count: posts.length,
      next: nextUrl?.toString(),
    };
  }

  async generatePosts() {
    for (let i = 0; i < 30; i++) {
      await this.createPost({
        postTitle: `임의로 생성된 포스트 제목 ${i}`,
        postContent: `임의로 생성된 포스트 내용 ${i}`,
        buildingName: '참빛관',
        chatRoomTitle: `임의로 생성된 채팅방 이름 ${i}`,
        postImage: 'wewerwer',
      });
    }
  }

  async getAllPost(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async getDormitoryPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '기숙사(빛솔재)',
      },
    });
  }

  async getBimaPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '비마관',
      },
    });
  }

  async getBokjiPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '복지관',
      },
    });
  }

  async getCenterLibraryPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '중앙 도서관',
      },
    });
  }

  async getChambitPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '참빛관',
      },
    });
  }

  async getTheaterPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '노천극장',
      },
    });
  }

  async getHanulPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '한울관',
      },
    });
  }

  async getSaebitPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '새빛관',
      },
    });
  }

  async getHwadoPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '화도관',
      },
    });
  }

  async getOkuiPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '옥의관',
      },
    });
  }

  async getNuriPost(): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        buildingName: '누리관',
      },
    });
  }

  async getOnePost(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { postTitle, postContent, buildingName, chatRoomTitle, postImage } =
      createPostDto;
    const post = new Post();
    post.postTitle = postTitle;
    post.buildingName = buildingName;
    post.chatRoomTitle = chatRoomTitle;
    post.postContent = postContent;
    post.postImage = postImage;

    return await this.postRepository.save(post);
  }

  async updatePost(id: number, updataPostDto: UpdatePostDto): Promise<Post> {
    const post = await this.getOnePost(id);
    const { postTitle, postContent, buildingName, chatRoomTitle } =
      updataPostDto;

    post.postTitle = postTitle;
    post.postContent = postContent;
    post.buildingName = buildingName;
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
}
