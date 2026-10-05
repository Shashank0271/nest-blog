import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../pagination/dtos/pagination-meta.dto';

interface StandardResponseOptions {
  isArray?: boolean;
}

export function StandardResponseType<Model extends Type<unknown>>(
  model: Model,
  { isArray = false }: StandardResponseOptions = {},
) {
  class StandardResponseDto {
    @ApiProperty({ type: () => model, isArray })
    data: InstanceType<Model> | InstanceType<Model>[];
  }

  // if 2 have the same name - both will have the same swagger schema
  Object.defineProperty(StandardResponseDto, 'name', {
    value: `Standard${model.name}${isArray ? 'Array' : ''}ResponseDto`,
  });

  return StandardResponseDto;
}

export function PaginatedResponseType<Model extends Type<unknown>>(
  model: Model,
) {
  class PaginatedResponseDto {
    @ApiProperty({ type: () => model, isArray: true })
    data: InstanceType<Model>[];

    @ApiProperty({ type: () => PaginationMetaDto })
    meta: PaginationMetaDto;
  }

  Object.defineProperty(PaginatedResponseDto, 'name', {
    value: `Paginated${model.name}ResponseDto`,
  });

  return PaginatedResponseDto;
}
