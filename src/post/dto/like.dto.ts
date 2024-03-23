import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';

export class LikePostDto {
  @IsString()
  postId: string;

  @IsInt()
  userId: number;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
