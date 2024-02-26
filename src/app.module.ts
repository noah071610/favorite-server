import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

// memo: 라이브러리 특성상 어쩔 수 없다.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    DatabaseModule,
    UserModule,
    UploadModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
