import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { AuthService } from './auth.service';
import {
  PayloadForValidateDto,
  RegisterUserDto,
} from './dto/payload.interface';
import { AuthGuard } from './guards/auth.guard';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { InstagramOauthGuard } from './guards/instagram-oauth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // GET
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

  @UseGuards(AuthGuard)
  @Get('user')
  isAuthenticated(@Req() req) {
    return {
      msg: 'ok',
      user: req.user,
    };
  }

  // POST
  @Post('find-email')
  async hasEmail(@Body() data: { email: string }) {
    return this.authService.hasEmail(data.email);
  }

  @Post('user')
  async register(@Body() data: RegisterUserDto, @Res() res: Response) {
    const { accessToken, ...user } = data;

    const registerRes = await this.authService.register(user, accessToken);
    await this.login(
      {
        email: registerRes.user.email,
        password: user.password,
        provider: user.provider,
        accessToken,
      },
      res,
    );
  }

  @Post('login')
  async login(
    @Body()
    payload: PayloadForValidateDto,
    @Res() res: Response,
  ) {
    const { user, msg, accessToken, refreshToken } =
      await this.authService.validateUser(payload);

    if (msg !== 'ok') {
      return res.send({
        msg,
        user,
      });
    }
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('favorite-cookie-kaokamu', refreshToken, {
      // httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, //30 day
    });

    return payload.provider === 'local'
      ? res.send({
          msg: 'ok',
          accessToken,
          user,
        })
      : res.redirect('http://localhost:3000/auth/loginSuccess');
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

  // GOOGLE
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleLogin(@Res() res: Response) {
    return res.redirect('/google/callback');
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    await this.register(req.user as RegisterUserDto, res);
  }

  // FACEBOOK
  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  facebookLogin(@Res() res: Response) {
    return res.redirect('/facebook/callback');
  }

  @UseGuards(FacebookOauthGuard)
  @Get('facebook/callback')
  async facebookLoginCallback(@Req() req, @Res() res: Response) {
    await this.register(req.user as RegisterUserDto, res);
  }

  // INSTAGRAM
  @Get('instagram')
  @UseGuards(InstagramOauthGuard)
  instagramLogin(@Res() res: Response) {
    return res.redirect('/instagram/callback');
  }

  @UseGuards(InstagramOauthGuard)
  @Get('instagram/callback')
  async instagramLoginCallback(@Req() req, @Res() res: Response) {
    await this.register(req.user as RegisterUserDto, res);
  }

  // TWITTER 잠정 중단
  // @Get('twitter')
  // @UseGuards(TwitterOauthGuard)
  // twitterLogin(@Res() res: Response) {
  //   return res.redirect('/twitter/callback');
  // }

  // @UseGuards(TwitterOauthGuard)
  // @Get('twitter/callback')
  // async twitterLoginCallback(@Req() req, @Res() res: Response) {
  //   await this.register(req.user as RegisterUser, res);
  // }
}
