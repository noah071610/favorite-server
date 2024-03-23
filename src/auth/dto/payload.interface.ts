import { Prisma } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PayloadDto {
  @IsInt()
  userId: number;

  @IsString()
  email: string;
}

export class PayloadForValidateDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export interface RegisterUserDto extends Prisma.UserCreateInput {
  accessToken?: string;
}
