import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommentDto } from 'src/comment/dto/comment.dto';
import { LikePostDto } from 'src/post/dto/like.dto';
import { PostDto } from 'src/post/dto/post.dto';
import { SaveDto } from 'src/post/dto/save.dto';

export class UserSelectDto {
  @IsInt()
  userId: number;

  @IsString()
  userName: string;

  @IsString()
  userImage: string;

  @IsString()
  color: string;
}

// User DTO
export class UserDto extends UserSelectDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  provider: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaveDto)
  saves: SaveDto[];

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  posts: PostDto[];

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LikePostDto)
  liked: LikePostDto[];

  @IsDate()
  createdAt: Date;
}
