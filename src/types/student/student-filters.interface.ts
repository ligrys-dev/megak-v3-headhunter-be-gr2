export interface StudentFilters {
  courseCompletion?: number;
  courseEngagement?: number;
  projectDegree?: number;
  teamProjectDegree?: number;
  'profile.expectedContractType'?: number;
  'profile.expectedTypeWork'?: number;
  'profile.expectedSalary'?: { min?: number; max?: number };
  'profile.canTakeApprenticeship'?: number;
  'profile.monthsOfCommercialExp'?: number;

  [key: string]: number | { min?: number; max?: number } | undefined;
}
