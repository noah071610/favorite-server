import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ErrorMessage } from 'src/error/messages';
import { LangType } from 'src/post/dto/post.dto';
import { PostMainDto } from 'src/post/dto/post.main';
import { getPostSelect } from 'src/post/select';
import { cacheKeys } from './keys';

@Injectable()
export class CachedService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly databaseService: DatabaseService,
  ) {}

  async getCachedPosts(key: 'template' | 'popular', lang: LangType) {
    const postsJSON: string | null = await this.cacheManager.get(
      cacheKeys[key],
    );

    if (!postsJSON?.length) {
      const postsArr = await this.databaseService.homepageData.findMany({
        where: {
          lang,
        },
        select: {
          name: true,
          data: true,
        },
      });
      const targetData = postsArr.find((v) => v.name === key)?.data;

      if (!targetData) {
        await this.cacheManager.set(key, JSON.stringify([]));
        return [];
      }
      const target: PostMainDto[] = JSON.parse(targetData);

      const arr = await Promise.allSettled(
        target.map(async ({ postId }) => {
          const post = await this.databaseService.post.findUnique({
            where: {
              postId,
            },
            select: getPostSelect,
          });
          if (!post)
            throw new HttpException(
              { msg: ErrorMessage.noPost, data: postId },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );

          post.content = JSON.parse(post.content ?? '');

          return post;
        }),
      ).then((v) => {
        // memo: 만약 에러가 나면.. 일단은 보여줘야하기 때문에 걸러줌 그래서 allSettled
        return v.filter((v) => v.status === 'fulfilled');
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jsonArr = arr.map(({ status, ...rest }) => rest);

      await this.cacheManager.set(key, JSON.stringify(jsonArr));

      return jsonArr;
    } else {
      return JSON.parse(postsJSON);
    }
  }
}
