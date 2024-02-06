import { NestFactory } from '@nestjs/core';
import { nanoid } from 'nanoid';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  console.log(nanoid(10));
  await app.listen(5555);
}
bootstrap();
