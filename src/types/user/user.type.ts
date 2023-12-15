import { Recruiter } from 'src/modules/hr-recruiter/entities/hr-recruiter.entity';
import { StudentInitial } from 'src/modules/student/entities/student-initial.entity';
import { Role } from './enums';

type StudentUser = {
  id: string;
  email: string;
  role: Role.STUDENT;
  student: StudentInitial;
  recruiter?: never;
};

type RecruiterUser = {
  id: string;
  email: string;
  role: Role.HR;
  student?: never;
  recruiter: Recruiter;
};

type AdminUser = {
  id: string;
  email: string;
  role: Role.ADMIN;
  student?: never;
  recruiter?: never;
};

export type UserType = StudentUser | RecruiterUser | AdminUser;
