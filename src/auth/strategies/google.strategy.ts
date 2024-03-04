import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService 사용을 위해 필요
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { _url } from 'src/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${_url.server}/auth/google/callback`,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const email = emails[0].value;
    const user: Prisma.UserCreateInput = {
      email,
      userName: `${name.givenName}${name.familyName ? ' ' + name.familyName : ''}`,
      provider: profile.provider,
      userImage: photos[0].value,
    };
    await this.cacheManager.set(accessToken, email);
    await done(null, { ...user, accessToken });
  }
}
