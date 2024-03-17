import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/passport.jwt.strategy';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [PostsController],
  providers: [PostsService, AuthService, JwtStrategy],
})
export class PostsModule {}
