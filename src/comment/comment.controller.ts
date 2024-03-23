import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(
    @Body()
    data: Prisma.CommentCreateInput,
  ) {
    return this.commentService.createComment(data);
  }
}
