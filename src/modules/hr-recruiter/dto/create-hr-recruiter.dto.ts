import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { NewRecruiterInterface } from 'src/types';

export class CreateHrRecruiterDto implements NewRecruiterInterface {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsInt()
  @Min(1)
  @Max(999)
  maxReservedStudents: number;

  @IsOptional()
  user: User;

  [key: string]: any;
}
