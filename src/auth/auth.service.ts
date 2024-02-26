import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';

import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async transformPassword(user: any) {
    const hashed = await bcrypt.hash(user.password, 10);
    return hashed;
  }

  async register(userDTO: Prisma.UserCreateInput) {
    const password = await this.transformPassword(userDTO);

    try {
      await this.databaseService.user.create({
        data: { ...userDTO, password },
      });
      return { msg: 'ok' };
    } catch (error) {
      if (error.meta.target[0] === 'email') {
        return { error: 'sameEmail' };
      }
    }
  }

  async validateUser({ email, password }: any) {
    const findUser = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
    if (!findUser) {
      throw new NotFoundException();
    }
    const validatePassword = await bcrypt.compare(password, findUser.password);
    if (!validatePassword) {
      throw new UnauthorizedException();
    }

    const payload: Payload = {
      userId: findUser.userId,
      userName: findUser.userName,
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
    };
  }

  async tokenValidateUser(payload: Payload): Promise<any | undefined> {
    return await this.databaseService.user.findUnique({
      where: {
        userId: payload.userId,
        userName: payload.userName,
      },
      select: {
        ...prismaExclude('User', ['password']),
      },
    });
  }

  async refreshToken(user: any) {
    const payload: Payload = {
      userId: user.userId,
      userName: user.userName,
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
