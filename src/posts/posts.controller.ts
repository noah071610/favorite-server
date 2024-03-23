import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LangType, PostFindQuery } from 'src/post/dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET

  @Get()
  findAllPosts(
    @Query('query') query: PostFindQuery,
    @Query('sort') sort: 'createdAt' | 'lastPlayedAt',
    @Query('lang') lang: LangType,
    @Query('cursor', ParseIntPipe) cursor: number,
  ) {
    return this.postsService.findAllPosts(query, sort, cursor, lang);
  }

  @Get('count')
  getAllPostsCount(@Query('query') query: PostFindQuery) {
    return this.postsService.getAllPostsCount(query);
  }

  @Get('popular')
  findPopularPosts(@Query('lang') lang: LangType) {
    return this.postsService.findPopularPosts(lang);
  }

  @Get('template')
  findTemplatePosts(@Query('lang') lang: LangType) {
    return this.postsService.findTemplatePosts(lang);
  }

  @Get('search')
  findSearchPosts(@Query('searchQuery') searchQuery: string) {
    return this.postsService.findSearchPosts(searchQuery);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  findUserSavePosts(@Req() req, @Query('cursor', ParseIntPipe) cursor: number) {
    return this.postsService.findUserSavePosts(cursor, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('user/count')
  getAllUserSaveCount(@Req() req) {
    return this.postsService.getAllUserSaveCount(req.user.userId);
  }

  @Get('sitemap')
  findAllSitemapPosts() {
    return this.postsService.findAllSitemapPosts();
  }
}
