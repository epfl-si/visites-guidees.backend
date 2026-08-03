import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebpackHotModule } from './types/nestjs';

declare const module: WebpackHotModule;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
