import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService 사용을 위해 필요
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Strategy } from 'passport-instagram';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      clientID: configService.get('INSTAGRAM_CLIENT_ID'),
      clientSecret: configService.get('INSTAGRAM_CLIENT_SECRET'),
      callbackURL: `https://localhost:5555/auth/instagram/callback`,
      scope: ['user_profile'], // 요청할 권한(scope) 설정
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, provider } = profile;
    //todo: 이메일 인증 인증 필요.....!!!!!!
    const email = 'insta@gmail.com';
    const user: Prisma.UserCreateInput = {
      email,
      userName: displayName,
      provider,
    };
    await this.cacheManager.set(accessToken, email);
    await done(null, { ...user, accessToken });
  }
}
