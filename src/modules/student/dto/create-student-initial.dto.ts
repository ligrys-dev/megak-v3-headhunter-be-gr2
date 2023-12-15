import {
  ArrayNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { StudentInitialInterface, StudentStatus } from 'src/types';

export class CreateStudentInitialDto implements StudentInitialInterface {
  @IsEmail({}, { message: 'adres kursanta musi być prawidłowym adresem email' })
  email: string;

  @IsNumber({}, { message: 'courseCompletion musi być liczbą' })
  @Min(0, { message: 'courseCompletion nie może być mniejsze niż 0' })
  @Max(5, { message: 'courseCompletion nie może być większe niż 5' })
  courseCompletion: number;

  @IsNumber({}, { message: 'courseEngagement musi być liczbą' })
  @Min(0, { message: 'courseEngagement nie może być mniejsze niż 0' })
  @Max(5, { message: 'courseEngagement nie może być większe niż 5' })
  courseEngagement: number;

  @IsNumber({}, { message: 'projectDegree musi być liczbą' })
  @Min(0, { message: 'projectDegree nie może być mniejsze niż 0' })
  @Max(5, { message: 'projectDegree nie może być większe niż 5' })
  projectDegree: number;

  @IsNumber({}, { message: 'teamProjectDegree musi być liczbą' })
  @Min(0, { message: 'teamProjectDegree nie może być mniejsze niż 0' })
  @Max(5, { message: 'teamProjectDegree nie może być większe niż 5' })
  teamProjectDegree: number;

  @IsOptional()
  @IsNumber()
  @Max(2)
  status: StudentStatus;

  @ArrayNotEmpty({
    message: 'Należy podać przynajmniej jeden adres URL w bonusProjectUrls',
  })
  @IsUrl(
    {},
    {
      message:
        'Każda wartość w bonusProjectUrls musi być prawidłowym adresem URL',
      each: true,
    },
  )
  bonusProjectUrls: string[];

  @IsOptional()
  user: User;

  [key: string]: any;
}
