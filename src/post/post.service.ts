import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

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

  async getOnePost(postIdx: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { postIdx } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postIdx} not found`);
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

  async updatePost(
    postIdx: number,
    updataPostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.getOnePost(postIdx);
    const { postTitle, postContent, buildingName, chatRoomTitle } =
      updataPostDto;

    post.postTitle = postTitle;
    post.postContent = postContent;
    post.buildingName = buildingName;
    post.chatRoomTitle = chatRoomTitle;

    return await this.postRepository.save(post);
  }

  async deletePost(postIdx: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { postIdx } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postIdx} not found`);
    }
    await this.postRepository.delete(postIdx);
    return post;
  }
}
