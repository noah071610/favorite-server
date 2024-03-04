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
  content: any;
  createdAt: Date;
  updatedAt: Date;
  lastPlayedAt: Date;
}
