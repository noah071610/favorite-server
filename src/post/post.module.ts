import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/passport.jwt.strategy';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [PostController],
  providers: [PostService, AuthService, JwtStrategy],
})
export class PostModule {}
