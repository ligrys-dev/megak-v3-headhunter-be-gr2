import { StudentStatus, TypeWork, ContractType } from './enums';

export interface StudentEntity
  extends StudentInitialEntity,
    StudentProfileEntity {
  status: StudentStatus;
}

export interface StudentInitialEntity {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string[];
}

export interface StudentProfileEntity {
  id: string;
  email: string;
  tel: string | null;
  firstName: string;
  lastName: string;
  avatar: string | null;
  githubUsername: string;
  portfolioUrls: string[] | null;
  projectUrls: string[];
  bio: string;
  expectedTypeWork: TypeWork;
  targetWorkCity: string;
  expectedContractType: ContractType;
  expectedSalary: number | null;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string | null;
  workExperience: string | null;
  courses: string | null;
}

export type NewStudentEntity = Omit<StudentEntity, 'id' | 'status'>;

export type ListOfStudentsResponse = StudentEntity[];

export type GetOneStudentResponse = StudentEntity;
