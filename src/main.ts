import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('PORT');
  const db = configService.get('DB_URL');
  const front_url = configService.get('FRONT_URL');

  app.enableCors({
    credentials: true,
    origin: front_url,
  });
  app.use(cookieParser());

  await mongoose.connect(db);

  await app.listen(port);
}
bootstrap();
