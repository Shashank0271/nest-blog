import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('/api/v1/tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  @ApiOperation({
    description: 'creates a new tag',
  })
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }
}
