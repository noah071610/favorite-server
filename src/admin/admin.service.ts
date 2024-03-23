import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { cacheKeys } from 'src/cache/keys';
import { DatabaseService } from 'src/database/database.service';
import { ErrorMessage } from 'src/error/messages';
import { LangType } from 'src/post/dto/post.dto';
import { getPostSelect } from 'src/post/select';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAdminRawData(lang: LangType) {
    const data = await this.databaseService.homepageData.findMany({
      where: {
        lang,
      },
      select: {
        name: true,
        rawData: true,
      },
    });

    if (!data.length) {
      await this.databaseService.homepageData.createMany({
        data: [
          {
            name: 'template',
            lang,
            data: '',
            rawData: '',
          },
          {
            name: 'popular',
            lang,
            data: '',
            rawData: '',
          },
        ],
      });
      return [
        {
          name: 'template',
          rawData: '',
        },
        {
          name: 'popular',
          rawData: '',
        },
      ];
    }

    return data;
  }

  async setPosts(
    rawData: string,
    postIdArr: string[],
    type: 'template' | 'popular',
    lang: LangType,
  ) {
    const arr = await Promise.all(
      postIdArr.map(async (postId) => {
        const target = await this.databaseService.post.findUnique({
          where: {
            postId,
          },
          select: getPostSelect,
        });
        if (!target)
          throw new HttpException(
            { msg: ErrorMessage.noPost, data: postId },
            HttpStatus.NOT_FOUND,
          );

        target.content = JSON.parse(target.content);

        return target;
      }),
    );

    const json = JSON.stringify(arr);

    await this.databaseService.homepageData.updateMany({
      where: {
        name: type,
        lang,
      },
      data: {
        data: json,
        rawData,
      },
    });
    await this.cacheManager.set(cacheKeys[type], json);
  }
}
