import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';

@Controller('/api/v1/posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Post()
  @ApiCreatedResponse({
    description: 'post created successfully',
  })
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('/:id')
  @ApiOperation({
    description: 'returns the post with given id',
  })
  @ApiOkResponse({
    description: 'required post object having given id',
  })
  public getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }

  @Get()
  public getPosts() {
    return this.postService.getPosts();
  }

  @Delete('/:id')
  @ApiOperation({
    description: 'deletes post with given id',
  })
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
