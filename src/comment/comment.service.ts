import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createComment(data: Prisma.CommentCreateInput) {
    await this.databaseService.comment.create({
      data,
    });
  }
}
