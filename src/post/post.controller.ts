import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostFindQuery } from 'src/types';
import { PostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // GET
  @Get()
  findOne(@Query('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Get('all')
  findAllPosts(
    @Query('query') query: PostFindQuery,
    @Query('sort') sort: 'createdAt' | 'lastPlayedAt',
    @Query('cursor', ParseIntPipe) cursor: number,
  ) {
    return this.postService.findAllPosts(query, sort, cursor);
  }

  @Get('popular')
  findPopularPosts() {
    return this.postService.findPopularPosts();
  }

  @Get('template')
  findTemplatePosts() {
    return this.postService.findTemplatePosts();
  }

  @Get('search')
  findSearchPosts(@Query('searchQuery') searchQuery: string) {
    return this.postService.findSearchPosts(searchQuery);
  }

  // POST
  @Post()
  createPost(@Body() createPostDto: PostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Post('comment')
  createComment(
    @Body()
    data: Prisma.CommentCreateInput,
  ) {
    return this.postService.createComment(data);
  }

  // Patch
  @Patch('like')
  like(
    // @Query('query') query: PostFindQuery,
    @Query('postId') postId: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.postService.like(userId, postId);
  }

  @Put('finish')
  finish(@Query('postId') postId: string, @Body() finishedPost: any) {
    return this.postService.finish(postId, finishedPost);
  }
}
