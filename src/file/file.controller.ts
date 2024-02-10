import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body: any, @UploadedFile() file) {
    console.log(file);

    return {
      body,
      file: file,
    };
  }
}
