import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { ContentDto, PostDto } from './dto/post.dto';

const getNewPostId = () => nanoid(12);

const getUser = {
  userName: true,
  userId: true,
  userImage: true,
  color: true,
};
const getComments = {
  createdAt: true,
  text: true,
  user: {
    select: {
      userName: true,
      userId: true,
      userImage: true,
      color: true,
    },
  },
};

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  validatePost(createPostDto: PostDto) {
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
  }

  async findOne(postId: string) {
    const post = await this.databaseService.post.findUnique({
      where: {
        postId, // todo:
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
    });
    await this.databaseService.save.update({
      where: {
        postId,
      },
      data: {
        count: {
          increment: 1, // 증가할 값
        },
      },
    });
  }

  async initNewPost(userId: number) {
    const newPostId = getNewPostId();
    await this.databaseService.save.create({
      data: {
        postId: newPostId,
        type: 'none',
        thumbnail: '',
        title: '',
        description: '',
        format: 'editing',
        count: 0,
        user: {
          connect: {
            userId,
          },
        },
        content: JSON.stringify({
          layout: 'textImage',
          resultDescription: '',
          newPostStatus: 'init',
          candidates: [],
          thumbnail: {
            imageSrc: '',
            type: 'custom',
            layout: [],
            slice: 0,
            isPossibleLayout: false,
          },
          selectedCandidateIndex: -1,
          isEditOn: false,
        }),
      },
    });
    return newPostId;
  }

  async copy(createPostDto: PostDto, userId: number) {
    const newPostId = getNewPostId();
    const { title, description, thumbnail, type } = createPostDto;
    await this.databaseService.save.create({
      data: {
        title,
        description,
        thumbnail,
        type,
        postId: newPostId,
        format: 'editing',
        count: 0,
        user: {
          connect: {
            userId,
          },
        },
        content: JSON.stringify({
          ...createPostDto.content,
          newPostStatus: 'edit',
          selectedCandidateIndex: -1,
          isEditOn: false,
        }),
      },
    });
    return newPostId;
  }

  async getSavePost(postId: string, userId: number) {
    const existingSaveData = await this.databaseService.save.findUnique({
      where: {
        userId,
        postId,
      },
      select: {
        ...prismaExclude('Save', ['createdAt', 'popular', 'id']),
      },
    });
    if (!existingSaveData)
      throw new NotFoundException('포스트를 찾을 수 없어요');

    existingSaveData.content = JSON.parse(existingSaveData.content as string);
    return existingSaveData;
  }

  async save(data: PostDto, userId: number) {
    await this.databaseService.save.update({
      where: { userId, postId: data.postId }, // 업데이트 또는 생성할 사용자의 고유 식별자
      data: {
        ...data,
        content: JSON.stringify(data.content),
      },
    });

    return { msg: 'ok' };
  }

  async posting(createPostDto: PostDto, userId: number) {
    this.validatePost(createPostDto);

    const existingPost = await this.databaseService.post.findUnique({
      where: { userId, postId: createPostDto.postId }, // 업데이트 또는 생성할 사용자의 고유 식별자
    });

    let data;
    if (existingPost) {
      const existingPostContent: ContentDto = JSON.parse(
        existingPost.content as string,
      );
      const existingCandidates = existingPostContent.candidates;
      data = {
        ...createPostDto,
        count: existingPost.count,
        userId,
        content: JSON.stringify({
          ...createPostDto.content,
          candidates: createPostDto.content.candidates.map((v) => {
            const existingCandidate = existingCandidates.find(
              (t) => t.listId === v.listId,
            );
            if (existingCandidate) {
              return {
                ...v,
                win: existingCandidate.win,
                lose: existingCandidate.lose,
                pick: existingCandidate.pick,
              };
            } else {
              return v;
            }
          }),
        }),
      };
    } else {
      data = {
        ...createPostDto,
        userId,
        content: JSON.stringify(createPostDto.content),
      };
    }

    await this.databaseService.post.upsert({
      where: { userId, postId: createPostDto.postId }, // 업데이트 또는 생성할 사용자의 고유 식별자
      create: data,
      update: data,
    });

    await this.databaseService.save.upsert({
      where: { userId, postId: createPostDto.postId }, // 업데이트 또는 생성할 사용자의 고유 식별자
      create: data,
      update: data,
    });

    return { msg: 'ok' };
  }

  async createComment(data: Prisma.CommentCreateInput) {
    await this.databaseService.comment.create({
      data,
    });
  }

  async delete(postId: string, userId: number) {
    await this.databaseService.save.delete({
      where: {
        postId,
        userId,
      },
    });

    const findPost = await this.databaseService.post.findUnique({
      where: {
        postId,
        userId,
      },
    });
    if (findPost) {
      await this.databaseService.post.delete({
        where: {
          postId,
          userId,
        },
      });
    }

    return { msg: 'ok' };
  }
}
