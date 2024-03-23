import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { UserSelectDto } from 'src/auth/dto/user.dto';

enum ContentLayoutType {
  text = 'text',
  image = 'image',
  textImage = 'textImage',
}

enum LangType {
  ko = 'ko',
  ja = 'ja',
  en = 'en',
  th = 'th',
}

enum PostFormatType {
  default = 'default',
  secret = 'secret',
  preview = 'preview',
  template = 'template',
  editing = 'editing',
}

enum PostingStatus {
  init = 'init',
  edit = 'edit',
  rendering = 'rending',
}

enum ThumbnailType {
  custom = 'custom',
  layout = 'layout',
  none = 'none',
}

class ThumbnailSettingType {
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

export class CandidateDto {
  @IsString()
  listId: string;

  @IsInt()
  number: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  imageSrc: string;

  @IsNumber()
  @Min(0)
  win: number;

  @IsNumber()
  @Min(0)
  lose: number;

  @IsNumber()
  @Min(0)
  pick: number;
}

export class ContentDto {
  @IsEnum(ContentLayoutType)
  layout: ContentLayoutType;

  @IsString()
  resultDescription: string;

  @IsEnum(PostingStatus)
  newPostStatus: PostingStatus;

  @ValidateNested({ each: true })
  candidates: CandidateDto[];

  @ValidateNested()
  @Type(() => ThumbnailSettingType)
  thumbnail: ThumbnailSettingType;

  @IsInt()
  selectedCandidateIndex: number;

  @IsBoolean()
  isEditOn: boolean;
}

export class PostMainDto {
  @IsString()
  postId: string;

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
}
