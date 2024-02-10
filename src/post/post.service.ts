import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { PostFindQuery } from 'src/types';

const pageSize = 10;

@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createNewPost(createPostDto: Prisma.PostCreateInput) {
    if (createPostDto.title.trim().length < 3)
      return '타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!';
    // if (!createPostDto.userId) return '로그인이 필요해요'; //todo: 이건 그래도 로그인 시켜야겠지..?
    if (!createPostDto.content) return '후보가 없네요.';
    if (!createPostDto.type) return '타입이 없네요.';

    const content = createPostDto.content as any[]; // todo: 타입.. 하..
    if (!content.length) return '후보가 없네요.';
    if (!content.every(({ title }) => !!title.trim()))
      return '타이틀이 없는 후보가 존재해요';
    createPostDto.content = JSON.stringify(content);

    const info = createPostDto.info as { [key: string]: any }; // todo: 타입.. 하..
    if (!Object.keys(info).every((key) => typeof info[key] !== 'undefined'))
      return '메타데이터 하나가 누락되었어요.';
    createPostDto.info = JSON.stringify(info);

    const newPost = await this.databaseService.post.create({
      data: createPostDto,
    });
    return newPost.postId;
  }

  async findAll(query: PostFindQuery, page: number) {
    //todo: 쿼리에 상응하는 서비스 작성
    const skip = (page - 1) * pageSize;

    const posts = await this.databaseService.post.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        user: {
          select: prismaExclude('User', ['createdAt', 'email']),
        },
        ...prismaExclude('Post', ['content']),
      },
    });

    await this.cacheService.set('test', posts);

    return posts.map((post) => ({
      ...post,
      info: JSON.parse(post.info as string),
    }));
  }

  async findOne(postId: string) {
    const post = await this.databaseService.post.findUnique({
      where: {
        postId,
      },
      select: {
        ...prismaExclude('Post', ['info']),
        user: {
          select: prismaExclude('User', ['createdAt', 'email']),
        },
        comments: {
          include: {
            user: {
              select: prismaExclude('User', ['createdAt', 'email']),
            },
          },
        },
      },
    });

    if (!post) throw new NotFoundException('포스트를 찾을 수 없어요');

    const content = JSON.parse(post.content as string);

    return { ...post, content };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
