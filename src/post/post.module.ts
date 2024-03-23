import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/passport.jwt.strategy';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, AuthService, JwtStrategy],
})
export class PostModule {}
