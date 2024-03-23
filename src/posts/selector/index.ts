import { prismaExclude } from 'src/config/database/prismaExclude';

export const getPostCardSelect = {
  ...prismaExclude('Post', ['content', 'updatedAt', 'userId', 'id']),
};

export const getUserSaveCardSelect = {
  ...prismaExclude('Save', ['content', 'updatedAt', 'userId', 'id']),
  post: {
    select: {
      count: true,
      format: true,
    },
  },
};
