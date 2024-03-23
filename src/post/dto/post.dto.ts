import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserSelectDto } from 'src/auth/dto/user.dto';
import { ContentDto } from './post.main';

export enum PostType {
  polling = 'polling',
  contest = 'contest',
  tournament = 'tournament',
}

export enum PostFindQuery {
  all = 'all',
  tournament = 'tournament',
  polling = 'polling',
  contest = 'contest',
}

export enum ContentLayoutType {
  text = 'text',
  image = 'image',
  textImage = 'textImage',
}

export enum LangType {
  ko = 'ko',
  ja = 'ja',
  en = 'en',
  th = 'th',
}

export enum PostFormatType {
  default = 'default',
  secret = 'secret',
  preview = 'preview',
  template = 'template',
  editing = 'editing',
}

export enum PostingStatus {
  init = 'init',
  edit = 'edit',
  rendering = 'rending',
}

export enum ThumbnailType {
  custom = 'custom',
  layout = 'layout',
  none = 'none',
}

export class ThumbnailSettingType {
  @IsString()
  imageSrc: string;

  @IsEnum(ThumbnailType)
  type: ThumbnailType;

  @IsString({ each: true })
  layout: string[];

  @IsInt()
  slice: number;

  @IsBoolean()
  isPossibleLayout: boolean;
}

export class PostDto {
  @IsInt()
  id: number;

  @IsString()
  postId: string;

  @IsInt()
  userId: number;

  @IsString()
  type: string;

  @IsEnum(PostFormatType)
  format: PostFormatType;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(LangType)
  lang: LangType;

  @IsInt()
  count: number;

  @ValidateNested()
  @Type(() => ContentDto)
  content: ContentDto;

  @ValidateNested()
  @Type(() => UserSelectDto)
  user: UserSelectDto;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  lastPlayedAt: Date;
}
