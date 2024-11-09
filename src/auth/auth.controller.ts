import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>, @Res({passthrough: true}) res: Response):
    Promise<{access_token: string, username: string, email: string, createdAt: Date}> {
    const result = await this.authService.signIn(signInDto.username, signInDto.password);
    // res.cookie('accessToken', tokens.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 15 * 60 * 1000, // 15 minutes
    //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    // });
    return result;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: Record<string, any>) {
    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response) {
    // res.clearCookie('accessToken', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    // });
    return {
      message: 'Logout successful'
    }
  }

  @UseGuards(AuthGuard)
  @Get('home')
  getHome(@Request() req: any) {
    return {
      success: true
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
