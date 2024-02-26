import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CandidateDto {
  @IsString()
  listId: string;

  @IsString()
  imageSrc: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  count: number;

  @IsNumber()
  number: number;
}

export class PollingContentDto {
  @IsOptional()
  @IsString()
  chartDescription?: string;

  @IsString()
  layout: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateDto)
  candidates: CandidateDto[];
}
