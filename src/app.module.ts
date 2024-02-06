import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [PostModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
