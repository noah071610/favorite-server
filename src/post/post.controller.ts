import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { PostDto } from './dto/post.dto';
import { SaveUpdateDto } from './dto/save.dto';
import { PostService } from './post.service';

@UseFilters(new HttpExceptionFilter())
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // for everyone
  @Get()
  findOne(@Query('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch('like')
  like(
    @Query('postId') postId: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.postService.like(userId, postId);
  }

  @Put('finish')
  finish(@Query('postId') postId: string, @Body() finishedPost: any) {
    return this.postService.finish(postId, finishedPost);
  }

  // new post flow
  @UseGuards(AuthGuard)
  @Post('init')
  initNewPost(@Query('lang') lang, @Req() req) {
    return this.postService.initNewPost(req.user.userId, lang);
  }

  @UseGuards(AuthGuard)
  @Post('save')
  save(@Body() data: SaveUpdateDto, @Req() req) {
    return this.postService.save(data, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('save')
  getSave(@Req() req, @Query('postId') postId: string) {
    return this.postService.getSavePost(postId, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  posting(@Body() createPostDto: PostDto, @Req() req) {
    return this.postService.posting(createPostDto, req.user.userId);
  }

  // others
  @UseGuards(AuthGuard)
  @Post('copy')
  copy(@Body() createPostDto: PostDto, @Req() req) {
    return this.postService.copy(createPostDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Delete()
  delete(@Req() req, @Query('postId') postId: string) {
    return this.postService.delete(postId, req.user.userId);
  }
}
