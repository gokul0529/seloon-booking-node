import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './modules/common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('nex-projects API')
    .setDescription('nex-projects API documentation')
    .setVersion('0.0.101')
    .addTag('projects')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'defaultBearerAuth',
    )
    .setContact(
      'sreesayanth',
      'https://dataguardnxt.com/',
      'sree@dataguardnxt.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable ValidationPipe for request validation
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`🚀 Server started on port ${process.env.PORT || 3000} `, 'Bootstrap');
}
bootstrap();

