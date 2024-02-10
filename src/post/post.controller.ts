import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostFindQuery } from 'src/types';
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
    @Query('query') query: PostFindQuery,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.postService.findAll(query, page);
  }

  @Post()
  newPost(@Query('postId') postId: string) {
    return this.postService.findOne(postId);
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
