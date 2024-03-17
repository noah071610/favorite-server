import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService 사용을 위해 필요
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Strategy } from 'passport-facebook';
import { _url } from 'src/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: `${_url.server}/auth/facebook/callback`,
      passReqToCallback: true,
      // scope: ['email', 'profile'],
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
    // any: any,
  ): Promise<any> {
    const { displayName, provider } = profile;
    //todo: 이메일 인증 인증 필요.....!!!!!!
    const email = 'facebook2@gmail.com';
    const user: Prisma.UserCreateInput = {
      email,
      userName: displayName,
      provider,
    };
    await this.cacheManager.set(accessToken, email);
    await done(null, { ...user, accessToken });
  }
}
