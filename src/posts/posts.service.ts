import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
    private readonly tagService: TagsService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, tagIds } = createPostDto;
    const createdPost = this.postRepository.create(createPostDto);
    const author = await this.userService.getUser(userId);
    const tags = tagIds ? await this.tagService.getTags(tagIds) : [];
    createdPost.user = author;
    createdPost.tags = tags;
    return this.postRepository.save(createdPost);
  }

  async getPost(postId: number): Promise<Post> {
    const requiredPost = await this.postRepository.findOneBy({ id: postId });
    if (!requiredPost) {
      throw new NotFoundException(`Post with id : ${postId} not found`);
    }
    return requiredPost;
  }

  async getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
        user: true,
      },
    });
  }

  async deletePost(postId: number) {
    const requiredPost = await this.postRepository.findOneBy({ id: postId });
    if (!requiredPost) {
      throw new NotFoundException(`Post with given id not found`);
    }
    return await this.postRepository.delete({ id: postId });
  }
}
