import { IsEnum } from 'class-validator';

export enum ProviderType {
  Google = 'google',
  Facebook = 'facebook',
  Instagram = 'instagram',
  Local = 'local',
}

export class ProviderDto {
  @IsEnum(ProviderType)
  provider: ProviderType;
}
