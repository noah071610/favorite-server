import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';
import { PostDto } from './post.dto';
import { ContentDto } from './post.main';

export class SaveUpdateDto {
  @IsString()
  postId: string;

  @IsString()
  type: string;

  @IsString()
  format: string;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  count: number;

  @IsString()
  lang: string;

  @ValidateNested()
  @Type(() => ContentDto)
  content: ContentDto;
}

export class SaveDto extends SaveUpdateDto {
  @IsInt()
  id: number;

  @IsInt()
  popular: number;

  @IsInt()
  userId: number;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => PostDto)
  post?: PostDto;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
