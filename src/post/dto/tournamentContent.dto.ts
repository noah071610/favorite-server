import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class TournamentCandidateDto {
  @IsString()
  listId: string;

  @IsString()
  imageSrc: string;

  @IsString()
  title: string;

  @IsNumber()
  win: number;

  @IsNumber()
  lose: number;

  @IsNumber()
  pick: number;

  @IsNumber()
  number: number;
}

export class TournamentContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TournamentCandidateDto)
  candidates: TournamentCandidateDto[];
}
