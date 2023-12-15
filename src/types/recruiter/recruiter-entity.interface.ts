export interface RecruiterInterface {
  id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
}

export type NewRecruiterInterface = Omit<RecruiterInterface, 'id'>;
