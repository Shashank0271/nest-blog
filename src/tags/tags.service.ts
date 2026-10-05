import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepostory: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagRepostory.save(createTagDto);
  }

  public async getTags(tagIds: number[]) {
    return await this.tagRepostory.find({
      where: {
        id: In(tagIds),
      },
    });
  }
}
