import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PostFindQuery } from 'src/types';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET

  @Get()
  findAllPosts(
    @Query('query') query: PostFindQuery,
    @Query('sort') sort: 'createdAt' | 'lastPlayedAt',
    @Query('cursor', ParseIntPipe) cursor: number,
  ) {
    return this.postsService.findAllPosts(query, sort, cursor);
  }

  @Get('popular')
  findPopularPosts() {
    return this.postsService.findPopularPosts();
  }

  @Get('template')
  findTemplatePosts() {
    return this.postsService.findTemplatePosts();
  }

  @Get('search')
  findSearchPosts(@Query('searchQuery') searchQuery: string) {
    return this.postsService.findSearchPosts(searchQuery);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  findUserSavePosts(@Req() req) {
    return this.postsService.findUserSavePosts(req.user.userId);
  }
}
