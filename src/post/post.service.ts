import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { prismaExclude } from 'src/config/database/prismaExclude';
import { DatabaseService } from 'src/database/database.service';
import { ErrorMessage } from 'src/error/messages';
import { LangType, PostDto } from './dto/post.dto';
import { ContentDto } from './dto/post.main';
import { SaveUpdateDto } from './dto/save.dto';

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

    if (!createPostDto)
      throw new HttpException(ErrorMessage.unknown, HttpStatus.BAD_REQUEST);
    if (!createPostDto.type)
      throw new HttpException(ErrorMessage.unknown, HttpStatus.BAD_REQUEST);
    if (createPostDto.title.trim().length < 3)
      throw new HttpException(ErrorMessage.postTitle, HttpStatus.BAD_REQUEST);

    if (candidates.length < 2)
      throw new HttpException(
        ErrorMessage.candidateLength,
        HttpStatus.BAD_REQUEST,
      );
    if (!candidates.every(({ title }) => !!title.trim()))
      throw new HttpException(
        ErrorMessage.noCandidateTitle,
        HttpStatus.BAD_REQUEST,
      );

    if (candidates.length < 2)
      throw new HttpException(
        ErrorMessage.candidateLength,
        HttpStatus.BAD_REQUEST,
      );
    if (!candidates.every(({ title }) => !!title.trim()))
      throw new HttpException(
        ErrorMessage.noCandidateTitle,
        HttpStatus.BAD_REQUEST,
      );
    if (
      createPostDto.type === 'contest' ||
      createPostDto.type === 'tournament' ||
      (createPostDto.type === 'polling' &&
        (createPostDto.content.layout === 'image' ||
          createPostDto.content.layout === 'textImage'))
    ) {
      if (!candidates.every(({ imageSrc }) => !!imageSrc.trim()))
        throw new HttpException(
          ErrorMessage.noCandidateImage,
          HttpStatus.BAD_REQUEST,
        );
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

    if (!post)
      throw new HttpException(ErrorMessage.noPost, HttpStatus.NOT_FOUND);

    const content = JSON.parse(post.content);
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

  async initNewPost(userId: number, lang: LangType) {
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
        lang,
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
    const { title, description, thumbnail, type, lang } = createPostDto;
    await this.databaseService.save.create({
      data: {
        title,
        description,
        thumbnail,
        type,
        postId: newPostId,
        format: 'editing',
        count: 0,
        lang,
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
      throw new HttpException(ErrorMessage.noPost, HttpStatus.NOT_FOUND);

    existingSaveData.content = JSON.parse(existingSaveData.content as string);
    return existingSaveData;
  }

  async save(data: SaveUpdateDto, userId: number) {
    await this.databaseService.save.update({
      where: { userId, postId: data.postId }, // 업데이트 또는 생성할 사용자의 고유 식별자
      data: {
        ...data,
        content: JSON.stringify(data.content),
      },
    });
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
  }
}
