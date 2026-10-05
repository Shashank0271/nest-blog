import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import Joi from 'joi';
import type { Paginated } from '../pagination/interfaces/paginated.interface';

const paginatedResponseSchema = Joi.object({
  data: Joi.array().required(),
  meta: Joi.object({
    itemsPerPage: Joi.number().integer().required(),
    totalItems: Joi.number().integer().required(),
    currentPage: Joi.number().integer().required(),
    totalPages: Joi.number().integer().required(),
    hasNext: Joi.boolean().required(),
  })
    .required()
    .unknown(false),
}).unknown(false);

function isPaginated(value: unknown): value is Paginated<unknown> {
  const { error } = paginatedResponseSchema.validate(value, {
    abortEarly: true,
  });
  return !error;
}

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((apiResponse: unknown): unknown => {
        if (isPaginated(apiResponse)) {
          return apiResponse;
        }

        return { data: apiResponse };
      }),
    );
  }
}
