import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';
import { PostDto } from 'src/post/dto/post.dto';

export class CommentDto {
  @IsInt()
  commentId: number;

  @IsString()
  text: string;

  @IsString()
  postId: string;

  @ValidateNested()
  @Type(() => PostDto)
  post: PostDto;

  @IsInt()
  userId: number;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsDate()
  createdAt: Date;
}
