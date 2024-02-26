import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { PostFindQuery } from 'src/types';
import { ContestContentDto } from './dto/contestContent.dto';
import { PollingContentDto } from './dto/pollingContent.dto';
import { PostInfoDto } from './dto/postInfo.dto';
import { TournamentContentDto } from './dto/tournamentContent.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createPost(createPostDto: Prisma.PostCreateInput) {
    if (createPostDto.title.trim().length < 3)
      return '타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!';
    if (!createPostDto.content) return '후보가 없네요.';
    if (!createPostDto.type) return '타입이 없네요.';

    if (
      createPostDto.type === 'polling' ||
      createPostDto.type === 'tournament'
    ) {
      const content: PollingContentDto | TournamentContentDto =
        createPostDto.content as any;
      if (!content.candidates.length) return '후보가 없네요.';
      if (!content.candidates.every(({ title }) => !!title.trim()))
        return '타이틀이 없는 후보가 존재해요';
      createPostDto.content = JSON.stringify(content);
    }
    if (createPostDto.type === 'contest') {
      const content: ContestContentDto = createPostDto.content as any; // todo: 타입.. 하..
      if (!content.left || !content.right) return '후보가 없네요.';
      if (
        ![content.left.title, content.right.title].every(
          (title) => !!title.trim(),
        )
      )
        return '타이틀이 없는 후보가 존재해요';
      createPostDto.content = JSON.stringify(content);
    }

    const info = createPostDto.info as { [key: string]: any }; // todo: 타입.. 하..
    if (!Object.keys(info).every((key) => typeof info[key] !== 'undefined'))
      return '메타데이터 하나가 누락되었어요.';
    createPostDto.info = JSON.stringify(info);

    console.log(createPostDto);

    const newPost = await this.databaseService.post.create({
      data: createPostDto,
    });

    return newPost.postId;
  }

  async findAllPosts(query: PostFindQuery, cursor: number) {
    const pageSize = 12;

    const posts = await this.databaseService.post.findMany({
      skip: cursor * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
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

  async like(userId: number, postId: string) {
    const post = await this.databaseService.post.findUnique({
      where: {
        postId,
      },
    });

    const info: PostInfoDto = JSON.parse(post.info as string);
    info.like++;
    info.participateCount++;
    if (info.participateImages.length < 10) {
      const user = await this.databaseService.user.findUnique({
        where: {
          userId,
        },
      });
      info.participateImages = [...info.participateImages, user.userImage];
    }

    await this.databaseService.user.update({
      where: {
        userId,
      },
      data: {
        liked: {
          create: {
            postId,
          },
        },
      },
    });

    await this.databaseService.post.update({
      where: {
        postId,
      },
      data: {
        info: JSON.stringify(info),
      },
    });

    return { msg: 'ok' };
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
