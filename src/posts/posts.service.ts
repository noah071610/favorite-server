import { Injectable } from '@nestjs/common';
import { CachedService } from 'src/cache/cached.service';
import { DatabaseService } from 'src/database/database.service';
import { LangType, PostFindQuery } from 'src/post/dto/post.dto';
import { PostCardDto, SaveCardDto } from './dto/posts.dto';
import { getPostCardSelect } from './selector';
import { getUserSaveCardSelect } from './selector/index';

const queries = ['all', 'tournament', 'contest', 'polling'];
const sorts = ['createdAt', 'lastPlayedAt', 'popular'];
const supportLng = ['ko', 'ja', 'en', 'th'];

const pageSize = 18;
const userPageSize = 11;

@Injectable()
export class PostsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cachedService: CachedService,
  ) {}

  async findAllSitemapPosts() {
    const posts = await this.databaseService.post.findMany({
      where: {
        format: 'default',
      },
      orderBy: { popular: 'desc' },
      select: {
        postId: true,
        createdAt: true,
      },
    });

    return posts;
  }

  async findAllPosts(
    query: PostFindQuery = PostFindQuery.all,
    sort: 'createdAt' | 'lastPlayedAt' | 'popular' = 'createdAt',
    cursor: number,
    lang: LangType = LangType.ko,
  ) {
    if (!supportLng.some((v) => v === lang)) {
      lang = LangType.ko;
    }
    if (!queries.some((v) => v === query)) {
      query = PostFindQuery.all;
    }
    if (!sorts.some((v) => v === sort)) {
      sort = 'createdAt';
    }

    lang = LangType.ko;
    //todo : 콘텐츠가 모이면 lang을 변수로 바꾸기

    const posts: PostCardDto[] = await this.databaseService.post.findMany({
      where: {
        AND: [
          { lang },
          {
            format: 'default',
          },
          query === 'all'
            ? {}
            : {
                type: query,
              },
        ],
      },
      skip: cursor * pageSize,
      take: pageSize,
      orderBy: { [sort]: 'desc' },
      select: getPostCardSelect,
    });

    return posts;
  }

  async getAllPostsCount(query: PostFindQuery = PostFindQuery.all) {
    if (!queries.some((v) => v === query)) {
      query = PostFindQuery.all;
    }

    const totalCount = await this.databaseService.post.count({
      where: {
        AND: [
          {
            format: 'default',
          },
          query === 'all'
            ? {}
            : {
                type: query,
              },
        ],
      },
    });

    return totalCount;
  }

  async findSearchPosts(searchQuery: string) {
    const posts = await this.databaseService.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
            },
          },
          {
            description: {
              contains: searchQuery,
            },
          },
        ],
      },
      select: getPostCardSelect,
    });

    return posts;
  }

  async findPopularPosts(lang: LangType) {
    lang = LangType.ko;
    //todo : 콘텐츠가 모이면 lang을 변수로 바꾸기
    return await this.cachedService.getCachedPosts('popular', lang);
  }

  async findUserSavePosts(cursor: number, userId: number) {
    const saves: SaveCardDto[] = await this.databaseService.save.findMany({
      where: {
        userId,
      },
      skip: cursor * userPageSize, // 11
      take: userPageSize,
      orderBy: {
        createdAt: 'desc',
      },
      select: getUserSaveCardSelect,
    });

    return saves.map((v) => {
      const { post, ...rest } = v;
      return {
        ...rest,
        count: post ? post.count : 0,
        format: post ? post.format : 'editing',
      };
    });
  }

  async getAllUserSaveCount(userId: number) {
    const totalCount = await this.databaseService.save.count({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return totalCount;
  }

  async findTemplatePosts(lang: LangType) {
    lang = LangType.ko;
    //todo : 콘텐츠가 모이면 lang을 변수로 바꾸기
    return await this.cachedService.getCachedPosts('template', lang);
  }
}
