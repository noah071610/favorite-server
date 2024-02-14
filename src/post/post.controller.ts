import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createNewPost(@Body() createPostDto: Prisma.PostCreateInput) {
    return this.postService.createNewPost(createPostDto);
  }

  @Get()
  findOne(@Query('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Get('all')
  find(
    // @Query('query') query: PostFindQuery,
    @Query('cursor', ParseIntPipe) cursor: number,
  ) {
    return this.postService.findAll('all', cursor);
  }

  @Post()
  newPost(@Query('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch('like')
  like(
    // @Query('query') query: PostFindQuery,
    @Query('postId') postId: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.postService.like(userId, postId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
