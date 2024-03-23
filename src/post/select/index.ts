import { prismaExclude } from 'src/config/database/prismaExclude';
import { userSelect } from './../../auth/select/index';

export const getPostSelect = {
  ...prismaExclude('Post', ['updatedAt', 'userId', 'lastPlayedAt', 'id']),
  ...userSelect,
};
