import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  public constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    { page, limit }: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const baseUrl = this.request.protocol + '://' + this.request.host + '/';

    console.log(baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const hasNext = page === totalPages;

    const data = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
        hasNext,
      },
    };
  }
}
