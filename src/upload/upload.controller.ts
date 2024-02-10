import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 1000 }),
    //     new FileTypeValidator({ fileType: 'image/jpeg' }),
    //   ],
    // }), todo: 설정
  ) {
    const random_name =
      Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('') + extname(file.originalname);
    return await this.uploadService.upload(random_name, file.buffer);
  }

  @Post('dev')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename(_, file, callback): void {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  devUpload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const random_name =
      Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('') + extname(file.originalname);
    return {
      msg: 'ok',
      imageSrc: `http://localhost:5555/uploads/${random_name}`,
    };
  }
}
