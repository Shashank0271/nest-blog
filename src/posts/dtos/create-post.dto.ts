import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostType } from '../enums/post-type.enum';
import { PostStatus } from '../enums/post-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title given to the post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  title: string;

  @ApiProperty({
    enum: PostType,
    description: 'Possible values are post , page , story , series',
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    enum: PostStatus,
    description: 'Possible values are draft , scheduled , review and published',
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiProperty({
    description: 'description of the post',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must contain only lowercase letters, numbers, and single hyphens',
  })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'url of the post image',
  })
  @IsOptional()
  @IsString()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'IS0861 date for when the image is published on',
  })
  @IsOptional()
  @IsISO8601()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tag-ids associated with the post',
    example: '[2 , 11 , 9]',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @ApiProperty({
    type: 'integer',
    required: true,
    name: 'authorId',
    description: 'user id of the author who created the post',
  })
  @IsNumber()
  userId: number;
}
