import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPost(): Promise<Post[]> {
    return await this.postRepository.find();
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { postTitle, postContent, buildingName, chatRoomTitle } =
      createPostDto;
    const post = new Post();
    post.postTitle = postTitle;
    post.buildingName = buildingName;
    post.chatRoomTitle = chatRoomTitle;
    post.postContent = postContent;

    return await this.postRepository.save(post);
  }
}
