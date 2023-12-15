import { User } from 'src/modules/user/entities/user.entity';
import { Role } from './enums';

export interface UserInterface {
  id: string;
  email: string;
  role: Role;
  pwdHash: string;
  isActive: boolean;
  activationToken: string;
  createdAt: Date;
}

export type SaveUserEntity = Omit<UserInterface, 'pwdHash' | 'activationToken'>;
export type NewUserEntity = Pick<UserInterface, 'email'>;

export interface UserWithRandomPwd {
  newUser: User;
  password: string;
}
