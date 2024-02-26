import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class CandidateDto {
  @IsString()
  listId: string;

  @IsString()
  imageSrc: string;

  @IsString()
  title: string;

  @IsNumber()
  count: number;
}

export class ContestContentDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CandidateDto)
  left: CandidateDto;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CandidateDto)
  right: CandidateDto;
}
