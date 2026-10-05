import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    const { method: httpMethod, url: requestUrl } = req;
    const startTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode.toString().startsWith('2')) {
        const endTime = new Date().getTime();
        console.log(
          `${httpMethod} ${requestUrl} ${statusCode} ${endTime - startTime}ms`,
        );
      }
    });

    next();
  }
}
