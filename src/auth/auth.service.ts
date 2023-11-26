import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { comparePwd } from 'src/utils/handle-pwd';
import { JwtService } from '@nestjs/jwt';
import { SaveUserEntity } from 'src/types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(user: SaveUserEntity, res: Response) {
    const usr = await this.userService.findOneById(user.id);

    if (!usr) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      role: usr.role,
      sub: usr.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, //XXX true in https
      maxAge: 1000 * 60 * 60, // 1h
    });

    return { ok: true };
  }

  async validateUser(email: string, pwd: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await comparePwd(pwd, user.pwdHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwdHash, activationToken, ...result } = user;
    return result as SaveUserEntity;
  }
}
