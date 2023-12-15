import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateHrRecruiterDto } from './dto/create-hr-recruiter.dto';
import { Recruiter } from './entities/hr-recruiter.entity';
import { StudentService } from '../student/student.service';
import { UserService } from '../user/user.service';
import { UserType } from 'src/types/user/user.type';
import { StudentStatus } from 'src/types';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HrRecruiterService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private studentService: StudentService,
  ) {}

  async create(createHrRecruiterDto: CreateHrRecruiterDto) {
    const recruiter = new Recruiter();
    for (const [key, value] of Object.entries(createHrRecruiterDto)) {
      recruiter[key] = value;
    }

    return await recruiter.save();
  }

  async reserveStudent(studentEmail: string, recruiterUserId: string) {
    const student =
      await this.studentService.findOneInitialProfile(studentEmail);

    const { recruiter } = (await this.userService.getSelf(
      recruiterUserId,
    )) as UserType;

    const reservedStudents = (await this.getAllReservedStudents(recruiter.id))
      .length;

    if (student.status === StudentStatus.CONVERSATION)
      throw new Error('This student is not available!');

    if (student.status === StudentStatus.HIRED)
      throw new Error('This student is already hired!');

    if (recruiter.maxReservedStudents < reservedStudents) {
      throw new Error('Maximum amount of reserved students reached!');
    }

    student.recruiter = recruiter;
    student.status = StudentStatus.CONVERSATION;
    student.reservationExpirationDate = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 10,
    );
    return await student.save();
  }

  async cancelReservation(studentEmail: string, recruiterUserId: string) {
    const student =
      await this.studentService.findOneInitialProfile(studentEmail);

    const { recruiter } = (await this.userService.getSelf(
      recruiterUserId,
    )) as UserType;

    console.log(recruiter.reservedStudents);

    student.reservationExpirationDate = null;
    student.status = StudentStatus.AVAILABLE;
    student.recruiter = null;

    return await student.save();
  }

  async getAllReservedStudents(recruiterId: string) {
    return await this.studentService.findAllReservedStudentsForRecruiter(
      recruiterId,
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async changeStudentStatusWhenExpired() {
    const students = await this.studentService.findAllReservedStudents();

    for (const student of students) {
      if (student.reservationExpirationDate <= new Date(Date.now())) {
        student.status = StudentStatus.AVAILABLE;
        student.reservationExpirationDate = null;
        await student.save();
      } else {
        continue;
      }
    }

    console.log(
      'Changing the status of students whose interview time has expired...',
    );
  }

  async hireStudent(studentEmail: string) {
    const student =
      await this.studentService.findOneInitialProfile(studentEmail);

    student.status = StudentStatus.HIRED;
    return await student.save();
  }
}
