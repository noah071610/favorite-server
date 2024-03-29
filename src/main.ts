import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*', // 원하는 허용된 오리진을 지정합니다.
      // methods: ['GET', 'POST'], // 허용할 HTTP 메서드를 지정합니다.
      allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더를 지정합니다.
      // credentials: true, // 자격 증명 헤더를 허용합니다.
      // maxAge: 3600, // 프리플라이트(Pre-flight) 요청의 최대 지속 시간을 지정합니다.
    },
    rawBody: true,
  });

  await app.listen(5555);
}
bootstrap();
