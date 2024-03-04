import { ProviderDto } from 'src/auth/dto/provider.dto';

export const cacheKeys = {
  tournament: (postId: string) => {
    return `tournament$content$${postId}`;
  },
  polling: (postId: string) => {
    return `polling$content$${postId}`;
  },
  contest: (postId: string) => {
    return `contest$content$${postId}`;
  },
  comments: (postId: string) => {
    return `comments$${postId}`;
  },
  social: (provider: ProviderDto) => {
    return `social$${provider}`;
  },
} as const;

// async getCachedComments(postId: string): Promise<
// {
//   userId: number;
//   userName: string;
//   text: string;
// }[]
// > {
// let commentsJSON: string | null = await this.cacheService.get(
//   cacheKeys['comments'](postId),
// );
// if (!commentsJSON) {
//   const findComments = await this.databaseService.comment.findMany({
//     where: {
//       postId: postId,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//     select: {
//       user: {
//         select: {
//           userId: true,
//           userName: true,
//         },
//       },
//       text: true,
//     },
//   });
//   commentsJSON = JSON.stringify(
//     findComments
//       ? findComments.map(({ user, text }) => ({
//           userId: user.userId,
//           userName: user.userName,
//           text,
//         }))
//       : [],
//   );
// }

// return JSON.parse(commentsJSON);
// }

// async getCachedContent(key: PostType, postId: string): Promise<PostDto> {
// let contentJSON: string | null = await this.cacheService.get(
//   cacheKeys[key](postId),
// );
// if (!contentJSON) {
//   const post = await this.databaseService.post.findUnique({
//     where: {
//       postId,
//     },
//     select: {
//       content: true,
//     },
//   });
//   contentJSON = JSON.stringify(JSON.parse(post.content as string));
// }

// return JSON.parse(contentJSON);
// }

// async setContentForCache(key: PostType, updatedPost: PostDto) {
// const postId = updatedPost.postId;

// await this.databaseService.post.update({
//   where: {
//     postId,
//   },
//   data: {
//     content: JSON.stringify(updatedPost.content),
//   },
// });

// await this.cacheService.set(
//   cacheKeys[key](postId),
//   JSON.stringify(updatedPost.content),
// );
// }
