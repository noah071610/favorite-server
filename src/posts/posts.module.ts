import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CachedService } from 'src/cache/cached.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtStrategy } from '../auth/strategies/passport.jwt.strategy';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [
    PostsService,
    AuthService,
    JwtStrategy,
    CachedService,
    DatabaseService,
  ],
})
export class PostsModule {}
