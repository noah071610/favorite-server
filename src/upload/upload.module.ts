import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [S3Client],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
