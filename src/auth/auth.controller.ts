import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './security/auth.guard';
import { RefreshJwtGuard } from './security/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user')
  async register(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() payload: any, @Res() res: Response) {
    const { user, accessToken, refreshToken } =
      await this.authService.validateUser(payload);

    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('favorite-cookie-kaokamu', refreshToken, {
      // httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, //30 day
    });

    return res.send({
      msg: 'ok',
      accessToken,
      user,
    });
  }

  @UseGuards(RefreshJwtGuard)
  @Get('user/refresh')
  async refreshToken(@Req() req, @Res() res: Response) {
    const jwt = await this.authService.refreshToken(req.user);

    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);

    return res.send({
      msg: 'ok',
      accessToken: jwt.accessToken,
      user: req.user,
    });
  }

  @Get('user')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req) {
    return {
      msg: 'ok',
      accessToken: null,
      user: req.user,
    };
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response): any {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    return res.send({
      msg: 'ok',
    });
  }
}
