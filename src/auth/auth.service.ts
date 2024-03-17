import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';

import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import getRandomColor from 'src/util/getRandomColor';
import { Payload, PayloadForValidate } from './dto/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async transformPassword(user: Prisma.UserCreateInput) {
    const hashed = await bcrypt.hash(user.password, 10);
    return hashed;
  }

  async register(userDTO: Prisma.UserCreateInput, accessToken?: string) {
    if (!userDTO.userName.trim()) {
      throw new BadRequestException('noUserName');
    }

    if (
      !userDTO.email.match(
        /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/,
      )
    ) {
      throw new BadRequestException('invalidEmail');
    }
    if (!userDTO.email.trim()) {
      throw new BadRequestException('noEmail');
    }

    if (userDTO.provider === 'local' && !userDTO.password.trim()) {
      throw new BadRequestException('noPassword');
    }

    const findUser = await this.databaseService.user.findUnique({
      where: {
        email: userDTO.email,
      },
    });

    if (findUser) {
      if (accessToken) {
        const emailCache = await this.cacheManager.get(accessToken);
        if (emailCache) {
          return {
            msg: 'ok',
            accessToken,
            user: findUser,
          };
        } else {
          throw new InternalServerErrorException('unknown');
        }
      }
      throw new ConflictException('existEmail');
    } else {
      const password = userDTO.password
        ? await this.transformPassword(userDTO)
        : undefined;

      const createUser = await this.databaseService.user.create({
        data: { ...userDTO, password, color: getRandomColor() },
      });
      return {
        msg: 'ok',
        accessToken,
        user: createUser,
      };
    }
  }

  async validateUser({
    email,
    provider,
    accessToken,
    password,
  }: PayloadForValidate) {
    const findUser = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      throw new BadRequestException('loginFailBadRequest');
    }

    if (provider === 'local' && findUser.provider !== 'local') {
      throw new ConflictException(`alreadySignup_${findUser.provider}`);
    }

    if (provider !== 'local') {
      // 소셜 로그인
      const emailCache = await this.cacheManager.get(accessToken);
      await this.cacheManager.del(accessToken);

      if (emailCache !== email) {
        throw new BadRequestException('unknown');
      }
    } else {
      if (!password?.trim()) return { msg: 'loginFailBadRequest', user: null };
      const validatePassword = await bcrypt.compare(
        password,
        findUser.password,
      );
      if (!validatePassword) {
        return { msg: 'loginFailBadRequest', user: null };
      }
    }

    const payload: Payload = {
      userId: findUser.userId,
      email: findUser.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: exclude, ...rest } = findUser;

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
      user: rest,
      msg: 'ok',
    };
  }

  async tokenValidateUser(payload: Payload): Promise<any | undefined> {
    return await this.databaseService.user.findUnique({
      where: {
        userId: payload.userId,
        email: payload.email,
      },
      select: {
        ...prismaExclude('User', ['password']),
      },
    });
  }

  async hasEmail(email: string) {
    const target = await this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        ...prismaExclude('User', ['password']),
      },
    });
    return !!target ? { msg: 'ok', email } : { msg: 'no', email: null };
  }

  async refreshToken(user: any) {
    const payload: Payload = {
      userId: user.userId,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }
}
