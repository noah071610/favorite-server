import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { PostFindQuery } from 'src/types';
import { PostDto } from './dto/post.dto';

const queries = ['all', 'tournament', 'contest', 'polling'];

const getPostsSelect = {
  ...prismaExclude('Post', ['content', 'updatedAt', 'userId', 'id']),
};
const getUser = {
  userName: true,
  userId: true,
  userImage: true,
};
const getComments = {
  createdAt: true,
  text: true,
  user: {
    select: {
      userName: true,
      userId: true,
    },
  },
};

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createPost(createPostDto: PostDto) {
    const candidates = createPostDto.content.candidates;

    if (!createPostDto) throw new BadRequestException('unknown');
    if (!createPostDto.type) throw new BadRequestException('unknown');
    if (createPostDto.title.trim().length < 3)
      throw new BadRequestException('postTitle');

    if (candidates.length < 2) throw new BadRequestException('candidateLength');
    if (!candidates.every(({ title }) => !!title.trim()))
      throw new BadRequestException('noCandidateTitle');

    if (candidates.length < 2) throw new BadRequestException('candidateLength');
    if (!candidates.every(({ title }) => !!title.trim()))
      throw new BadRequestException('noCandidateTitle');
    if (
      createPostDto.type === 'contest' ||
      createPostDto.type === 'tournament' ||
      (createPostDto.type === 'polling' &&
        (createPostDto.content.layout === 'image' ||
          createPostDto.content.layout === 'textImage'))
    ) {
      if (!candidates.every(({ imageSrc }) => !!imageSrc.trim()))
        throw new BadRequestException('noCandidateImage');
    }

    createPostDto.content = JSON.stringify(createPostDto.content);

    const newPost = await this.databaseService.post.create({
      data: createPostDto,
      select: getPostsSelect,
    });

    return newPost;
  }

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

  async findOne(postId: string) {
    const post = await this.databaseService.post.findUnique({
      where: {
        postId,
      },
      include: {
        user: {
          select: getUser,
        },
        comments: {
          select: getComments,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) throw new NotFoundException('포스트를 찾을 수 없어요');

    const content = JSON.parse(post.content as string);

    return { ...post, content };
  }

  async createComment(data: Prisma.CommentCreateInput) {
    await this.databaseService.comment.create({
      data,
    });
  }

  async like(userId: number, postId: string) {
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

  async finish(postId: string, finishedPost: any) {
    await this.databaseService.post.update({
      where: {
        postId,
      },
      data: {
        count: {
          increment: 1, // 증가할 값
        },
        content: JSON.stringify(finishedPost.content),
      },
      select: getPostsSelect,
    });
  }
}
