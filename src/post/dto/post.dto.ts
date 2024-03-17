export type ContentLayoutType = 'text' | 'image' | 'textImage';
export type PostFormatType =
  | 'default'
  | 'secret'
  | 'preview'
  | 'template'
  | 'editing';
export type PostingStatus = 'init' | 'edit' | 'rending';
export type PostContentType = 'polling' | 'contest' | 'tournament';
export type ThumbnailType = 'custom' | 'layout' | 'none';
export interface ThumbnailSettingType {
  imageSrc: string;
  type: ThumbnailType;
  layout: string[];
  slice: number;
  isPossibleLayout: boolean;
}
export type PostFindQuery = 'all' | PostContentType;

export interface CandidateDto {
  listId: string;
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  win: number;
  lose: number;
  pick: number;
}

export class PostDto {
  id: number;
  postId: string;
  userId: number;
  type: string;
  format: string;
  thumbnail: string;
  title: string;
  description: string;
  count: number;
  content: ContentDto;
  createdAt: Date;
  updatedAt: Date;
  lastPlayedAt: Date;
}

export class ContentDto {
  layout: ContentLayoutType;
  resultDescription: string;
  newPostStatus: PostingStatus;
  candidates: CandidateDto[];
  thumbnail: ThumbnailSettingType;
  selectedCandidateIndex: number;
  isEditOn: boolean;
}
