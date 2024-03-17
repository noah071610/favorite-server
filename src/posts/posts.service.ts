import { Injectable } from '@nestjs/common';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { PostFindQuery } from 'src/types';

const queries = ['all', 'tournament', 'contest', 'polling'];

const getPostsSelect = {
  ...prismaExclude('Post', ['content', 'updatedAt', 'userId', 'id']),
};

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllPosts(
    query: PostFindQuery = 'all',
    sort: 'createdAt' | 'lastPlayedAt' = 'createdAt',
    cursor: number,
  ) {
    if (!queries.some((v) => v === query)) {
      query = 'all';
    }
    if (!['createdAt', 'lastPlayedAt'].some((v) => v === sort)) {
      sort = 'createdAt';
    }

    const pageSize = 12;

    const posts = await this.databaseService.post.findMany({
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
      skip: cursor * pageSize,
      take: pageSize,
      orderBy: { [sort]: 'desc' },
      select: getPostsSelect,
    });

    return posts;
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
      select: getPostsSelect,
    });

    return posts;
  }

  async findPopularPosts() {
    const posts = await this.databaseService.post.findMany({
      where: {
        popular: {
          gt: 0,
        },
      },
      take: 9,
      select: getPostsSelect,
    });

    return posts;
  }

  async findUserSavePosts(userId: number) {
    const saves = await this.databaseService.save.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        ...prismaExclude('Save', ['content', 'updatedAt', 'userId', 'id']),
        post: {
          select: {
            count: true,
            format: true,
          },
        },
      },
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

  async findTemplatePosts() {
    const posts = await this.databaseService.post.findMany({
      where: {
        format: 'template',
      },
      orderBy: {
        popular: 'desc',
      },
      take: 15, // todo:
      select: {
        ...prismaExclude('Post', ['updatedAt', 'userId', 'id']),
      },
    });

    return posts.map((v) => ({
      ...v,
      content: JSON.parse((v.content as string) ?? '{}'),
    }));
  }
}
