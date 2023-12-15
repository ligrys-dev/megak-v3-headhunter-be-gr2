import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserFromReq, UserJwtPayload } from 'src/types';
import { Request } from 'express';

function cookieExtractor(req: Request): null | string {
  return req && req.cookies ? req.cookies?.access_token ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserJwtPayload) {
    return {
      userId: payload.sub,
      role: payload.role,
      isActive: payload.isActive,
    } as UserFromReq;
  }
}
