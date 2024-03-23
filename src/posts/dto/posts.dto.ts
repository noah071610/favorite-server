import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

export class PostCardDto {
  @IsDate()
  createdAt: Date;

  @IsDate()
  lastPlayedAt: Date;

  @IsNumber()
  popular: number;

  @IsString()
  type: string;

  @IsString()
  postId: string;

  @IsString()
  format: string;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  count: number;

  @IsString()
  lang: string;
}

class PostDataForSaveDto {
  @IsNumber()
  count: number;

  @IsString()
  format: string;
}

export class SaveCardDto {
  @IsDate()
  createdAt: Date;

  @IsNumber()
  popular: number;

  @IsString()
  type: string;

  @IsString()
  postId: string;

  @IsString()
  format: string;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  count: number;

  @IsString()
  lang: string;

  @ValidateNested()
  @Type(() => PostDataForSaveDto)
  post: PostDataForSaveDto;
}
