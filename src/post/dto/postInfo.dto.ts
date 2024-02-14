import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PostInfoDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true }) // 각각의 요소가 문자열인지 확인
  participateImages: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // 0 이상인지 확인
  shareCount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // 0 이상인지 확인
  like: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // 0 이상인지 확인
  participateCount: number;
}
