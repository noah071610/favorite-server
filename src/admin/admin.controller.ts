import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { LangType } from 'src/post/dto/post.dto';
import { AdminService } from './admin.service';

@UseFilters(new HttpExceptionFilter())
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminGuard)
  @Get('data')
  getAdminRawData(@Query('lang') lang: LangType) {
    return this.adminService.getAdminRawData(lang);
  }

  @UseGuards(AdminGuard)
  @Post('data')
  setPosts(
    @Query('type') type: 'template' | 'popular',
    @Query('lang') lang: LangType,
    @Body() data: { postIdArr: string[]; rawData: string },
  ) {
    return this.adminService.setPosts(data.rawData, data.postIdArr, type, lang);
  }
}
