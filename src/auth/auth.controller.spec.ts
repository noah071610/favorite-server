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

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthService,
        JwtStrategy,
        JwtService,
        RefreshJwtStrategy,
        GoogleStrategy,
        FacebookStrategy,
        InstagramStrategy,
        DatabaseService,
        ConfigService,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
