import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { ContractType, TypeWork } from 'src/types';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  id: string;
  avatar: string | null;
  bio: string;
  bonusProjectUrls: string[];
  canTakeApprenticeship: boolean;
  courseCompletion: number;
  courseEngagement: number;
  courses: string | null;
  education: string | null;
  email: string;
  expectedContractType: ContractType;
  expectedSalary: number | null;
  expectedTypeWork: TypeWork;
  firstName: string;
  githubUsername: string;
  lastName: string;
  monthsOfCommercialExp: number;
  portfolioUrls: string[] | null;
  projectDegree: number;
  projectUrls: string[];
  targetWorkCity: string;
  teamProjectDegree: number;
  tel: string | null;
  workExperience: string | null;
  status: number;
  [key: string]: any;
}
