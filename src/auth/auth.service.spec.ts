import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { JwtStrategy } from './strategies/passport.jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        RefreshJwtStrategy,
        GoogleStrategy,
        JwtService,
        FacebookStrategy,
        InstagramStrategy,
        DatabaseService,
        ConfigService,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
