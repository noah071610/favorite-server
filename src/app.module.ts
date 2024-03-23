import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CachedService } from './cache/cached.service';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './database/database.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { PostModule } from './post/post.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';

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
    JwtModule.register({
      global: true,
    }),
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    DatabaseModule,
    UploadModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow('THROTTLE_TTL'),
          limit: config.getOrThrow('THROTTLE_LIMIT'),
        },
      ],
    }),
    PostsModule,
    AdminModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    CachedService,
  ],
})
export class AppModule {}
