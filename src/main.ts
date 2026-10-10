import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StandardResponseInterceptor } from './common/interceptors/standard-response.interceptor.';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog-App Api')
    .setDescription('Use the BASE API URL as http://localhost:3000/api/v1')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .addServer('http://localhost:3000/api/v1')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  app.useGlobalInterceptors(new StandardResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
