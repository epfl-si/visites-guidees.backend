import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebpackHotModule } from './types/nestjs';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: WebpackHotModule;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Guided Tours API')
    .setDescription('API documentation for the Guided Tours application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your Azure AD access token',
        in: 'header',
      },
      'access-token', // this name here is important for matching up with @ApiBearerAuth() decorator
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      void app.close();
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
