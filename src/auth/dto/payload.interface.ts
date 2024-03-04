import { Prisma } from '@prisma/client';

export interface Payload {
  userId: number;
  email: string;
}

export interface PayloadForValidate {
  email: string;
  provider?: string;
  accessToken?: string;
  password?: string;
}

export interface RegisterUser extends Prisma.UserCreateInput {
  accessToken?: string;
}
