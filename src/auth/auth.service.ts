import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { Response } from 'express';
import { comparePwd } from 'src/utils/handle-pwd';
import { JwtService } from '@nestjs/jwt';
import { Role, SaveUserEntity, StudentStatus, UserJwtPayload } from 'src/types';
import { StudentService } from 'src/modules/student/student.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private studentService: StudentService,
  ) {}
  async login(user: SaveUserEntity, res: Response) {
    const usr = await this.userService.findOneById(user.id);

    if (!usr) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      role: usr.role,
      isActive: usr.isActive,
      sub: usr.id,
    } as UserJwtPayload;

    const accessToken = await this.jwtService.signAsync(payload);

    res.cookie('access_token', accessToken, {
      secure: false, //XXX true in https
      domain: 'localhost',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24h
    });

    return { id: usr.id, role: usr.role };
  }

  async logout(res: Response) {
    try {
      res.clearCookie('access_token', {
        secure: false,
        httpOnly: true,
        domain: 'localhost',
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async validateUser(email: string, pwd: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new UnauthorizedException('User not activated');

    const isPasswordValid = await comparePwd(pwd, user.pwdHash);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (user.role === Role.STUDENT) {
      const student = await this.studentService.findOneInitialProfile(email);

      if (student && student.status === StudentStatus.HIRED) {
        throw new UnauthorizedException('Access denied for hired students');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwdHash, activationToken, ...result } = user;
    return result as SaveUserEntity;
  }
}
