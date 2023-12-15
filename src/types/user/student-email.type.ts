export type FailedEmails = {
  email: string;
  errorDetails: string[];
}[];

export type SuccessfulEmails = string[];

export type StudentEmails = [FailedEmails, SuccessfulEmails] | undefined;
