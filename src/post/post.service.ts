import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { PostFindQuery } from 'src/types';

const pageSize = 3;

@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  create(createPostDto: Prisma.PostCreateInput) {
    return this.databaseService.post.create({ data: createPostDto });
  }

  async findAll(query: PostFindQuery, page: number) {
    //todo: 쿼리에 상응하는 서비스 작성
    const skip = (page - 1) * pageSize;

    const posts = await this.databaseService.post.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: prismaExclude('Post', ['info', 'thumbnail']),
    });

    await this.cacheService.set('test', posts);

    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
