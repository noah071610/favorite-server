import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AdminJwtStrategy } from 'src/auth/strategies/admin.jwt.strategy';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, AuthService, AdminJwtStrategy],
})
export class AdminModule {}
