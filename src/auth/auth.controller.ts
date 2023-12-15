import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { SaveUserEntity } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user as SaveUserEntity, res);
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
