import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: number) {
    //todo: 패스포트, 로그인 구현
    const user = await this.databaseService.user.findUniqueOrThrow({
      where: {
        userId,
      },
      select: {
        liked: {
          select: {
            postId: true,
          },
        },
        ...prismaExclude('User', ['password', 'createdAt']),
      },
    });

    return {
      ...user,
      liked: user.liked ? user.liked.map((v) => v.postId) : [],
    };
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
