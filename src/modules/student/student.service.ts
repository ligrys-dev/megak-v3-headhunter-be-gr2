import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateStudentInitialDto } from './dto/create-student-initial.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { StudentProfile } from './entities/student-profile.entity';
import { StudentInitial } from './entities/student-initial.entity';
import { InvalidDataFormatException } from '../../common/exceptions/invalid-data-format.exception';
import {
  FilteredStudents,
  StudentFilters,
  StudentOrderByOptions,
  StudentStatus,
  UserType,
} from 'src/types';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async findOneInitialProfile(email: string): Promise<StudentInitial> {
    return StudentInitial.findOneOrFail({
      where: { email },
    });
  }

  async findOneProfile(id: string): Promise<StudentProfile> {
    return StudentProfile.findOneOrFail({
      where: { id },
      relations: ['initialData'],
    });
  }

  async createStudentProfile(
    createStudentDto: CreateStudentProfileDto,
    userId: string,
  ): Promise<StudentProfile> {
    const newStudent = new StudentProfile();
    const user = (await this.userService.getSelf(userId)) as UserType;

    Object.keys(createStudentDto).forEach((prop) => {
      newStudent[prop] = createStudentDto[prop];
    });

    newStudent.initialData = user.student;

    const checkGitHubUsername: Response = await fetch(
      `https://api.github.com/users/${newStudent.githubUsername}`,
    );
    const res = await checkGitHubUsername.json();

    if (res.message === 'Not Found' && newStudent.githubUsername !== '') {
      throw new InvalidDataFormatException('GitHub username does not exist');
    }

    const githubUsernameAlreadyUsed = await this.findByGithubUsername(
      newStudent.githubUsername,
    );

    if (
      githubUsernameAlreadyUsed.length > 0 &&
      newStudent.githubUsername !== ''
    ) {
      throw new InvalidDataFormatException(
        'GitHub username already used on this website',
      );
    }

    await newStudent.save();
    return newStudent;
  }

  async createInitialProfile(
    initialProfile: CreateStudentInitialDto,
  ): Promise<StudentInitial> {
    const newInitialProfile = new StudentInitial();

    Object.keys(initialProfile).forEach((prop) => {
      newInitialProfile[prop] = initialProfile[prop];
    });

    newInitialProfile.status = StudentStatus.AVAILABLE;

    await newInitialProfile.save();
    return newInitialProfile;
  }

  async updateStudentProfile(
    id: string,
    updateStudentDto: UpdateStudentProfileDto,
  ): Promise<StudentProfile> {
    const updatingStudent = await this.findOneProfile(id);

    Object.keys(updateStudentDto).forEach((prop) => {
      updatingStudent[prop] = updateStudentDto[prop];
    });

    await updatingStudent.save();
    return StudentProfile.findOneOrFail({
      where: {
        id: updatingStudent.id,
      },
    });
  }

  async findByGithubUsername(
    githubUsername: string,
  ): Promise<StudentProfile[]> {
    return StudentProfile.find({
      where: {
        githubUsername,
      },
    });
  }

  async findAllReservedStudentsForRecruiter(
    recruiterId: string,
  ): Promise<StudentInitial[]> {
    return await StudentInitial.createQueryBuilder()
      .where(`recruiterId = "${recruiterId}"`)
      .getMany();
  }

  async findAllReservedStudents(): Promise<StudentInitial[]> {
    return await StudentInitial.find({
      where: {
        status: `${StudentStatus.CONVERSATION}` as unknown as number,
      },
    });
  }

  async filterAndSortStudents(
    page: number = 1,
    take: number = 10,
    status: StudentStatus = StudentStatus.AVAILABLE,
    orderBy: StudentOrderByOptions,
    filters: StudentFilters,
    recruiterUserId: string,
  ): Promise<FilteredStudents> {
    const { recruiter } = (await this.userService.getSelf(
      recruiterUserId,
    )) as UserType;

    const queryBuilder = StudentInitial.createQueryBuilder('student')
      .innerJoinAndSelect('student.profile', 'profile')
      .where(`status = "${status}"`);

    if (status === StudentStatus.CONVERSATION) {
      queryBuilder.andWhere(`recruiter = "${recruiter.id}"`);
    }

    if (filters) {
      if (filters.courseCompletion)
        queryBuilder.andWhere(
          `courseCompletion > "${filters.courseCompletion}"`,
        );

      if (filters.courseEngagement)
        queryBuilder.andWhere(
          `courseEngagement > "${filters.courseEngagement}"`,
        );

      if (filters.projectDegree)
        queryBuilder.andWhere(`projectDegree > "${filters.projectDegree}"`);

      if (filters.teamProjectDegree)
        queryBuilder.andWhere(
          `teamProjectDegree > "${filters.teamProjectDegree}"`,
        );

      if (filters['profile.monthsOfCommercialExp'])
        queryBuilder.andWhere(
          `profile.monthsOfCommercialExp > "${filters['profile.monthsOfCommercialExp']}"`,
        );

      if (filters['profile.canTakeApprenticeship'])
        queryBuilder.andWhere(
          `profile.canTakeApprenticeship = "${filters['profile.canTakeApprenticeship']}"`,
        );

      if (filters['profile.expectedContractType'])
        queryBuilder.andWhere(
          `profile.expectedContractType = "${filters['profile.expectedContractType']}"`,
        );

      if (filters['profile.expectedTypeWork'])
        queryBuilder.andWhere(
          `profile.expectedTypeWork = "${filters['profile.expectedTypeWork']}"`,
        );

      if (filters['profile.expectedSalary'])
        queryBuilder
          .andWhere(
            `profile.expectedSalary > "${
              filters['profile.expectedSalary'].min ?? 0
            }"`,
          )
          .andWhere(
            `profile.expectedSalary < "${
              filters['profile.expectedSalary'].max ?? 99999999.99
            }"`,
          );
    }

    const [students, studentsCount] = await queryBuilder
      .orderBy(orderBy ?? null, 'DESC')
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();

    const numberOfPages = Math.ceil(studentsCount / take);

    return { students, studentsCount, numberOfPages };
  }

  async markEmployed(studentUserId: string): Promise<StudentInitial> {
    const { student } = (await this.userService.getSelf(
      studentUserId,
    )) as UserType;

    student.status = StudentStatus.HIRED;
    return await student.save();
  }
}
