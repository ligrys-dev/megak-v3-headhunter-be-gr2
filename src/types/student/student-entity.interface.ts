import {
  StudentStatus,
  TypeWork,
  ContractType,
  RecruiterInterface,
} from 'src/types';

export interface StudentInitialInterface {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  status: StudentStatus;
  bonusProjectUrls: string[];
  profile?: StudentProfileInterface;
  recruiter?: RecruiterInterface;
  reservationExpirationDate?: Date;
}

export type OneStudentInitialResponse = StudentInitialInterface;
export type ListOfStudentInitialResponse = StudentInitialInterface[];
export interface FilteredStudents {
  students: ListOfStudentInitialResponse;
  studentsCount: number;
  numberOfPages: number;
}

export interface StudentProfileInterface {
  id: string;
  initialData: StudentInitialInterface;
  tel: string | null;
  firstName: string;
  lastName: string;
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

export type NewStudentProfileInterface = Omit<
  StudentProfileInterface,
  'id' | 'initialData'
>;

export type OneStudentProfileResponse = StudentProfileInterface;
export type ListOfStudentProfilesResponse = StudentProfileInterface[];
