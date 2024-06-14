import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { Custom } from './common/custom';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  Custom.init(app);
  await app.listen(3000);
}
bootstrap();
