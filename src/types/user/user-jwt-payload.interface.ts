import { Role } from './enums';

export interface UserJwtPayload {
  sub: string;
  isActive: boolean;
  role: Role;
}

export interface UserFromReq {
  userId: string;
  isActive: boolean;
  role: Role;
}
