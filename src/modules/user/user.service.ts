/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/common/mail/mail.service';
import { HrRecruiterService } from '../hr-recruiter/hr-recruiter.service';
import { StudentService } from '../student/student.service';
import { CreateHrRecruiterDto } from '../hr-recruiter/dto/create-hr-recruiter.dto';
import { CreateStudentInitialDto } from '../student/dto/create-student-initial.dto';
import { comparePwd, hashPwd } from 'src/utils/handle-pwd';
import { generateRandomPwd } from 'src/utils/generate-random-pwd';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from './entities/user.entity';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  StudentEmails,
  Role,
  UserFromReq,
  UserWithRandomPwd,
  FailedEmails,
  SuccessfulEmails,
} from 'src/types';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
    @Inject(forwardRef(() => HrRecruiterService))
    private hrRecruiterService: HrRecruiterService,
  ) {}

  async getSelf(id: string) {
    const user = await User.findOneOrFail({
      where: { id },
      relations: ['recruiter', 'student', 'student.profile'],
    });

    if (user.role === Role.ADMIN) {
      return { id: user.id, email: user.email, role: user.role };
    }

    if (!user.recruiter) {
      const {
        recruiter,
        activationToken,
        createdAt,
        isActive,
        pwdHash,
        ...result
      } = user;
      return result;
    }

    if (!user.student) {
      const {
        student,
        activationToken,
        createdAt,
        isActive,
        pwdHash,
        ...result
      } = user;
      return result;
    }
  }

  async findOneByEmail(email: string) {
    return await User.findOneBy({ email });
  }

  async findOneById(id: string) {
    return await User.findOneBy({ id });
  }

  async createStudents(createStudentDtos: CreateStudentInitialDto[]) {
    const createdUsers: UserWithRandomPwd[] = [];
    const successfulEmails: SuccessfulEmails = [];
    const failedEmails: FailedEmails = [];

    try {
      for (const createStudentDto of createStudentDtos) {
        const validation = await this.validateStudentInitial(createStudentDto);

        if (!validation.isValid) {
          failedEmails.push({
            email: createStudentDto.email,
            errorDetails: validation.errorDetails,
          });
          continue;
        }

        const isExisted = await this.findOneByEmail(createStudentDto.email);
        if (isExisted) {
          failedEmails.push({
            email: createStudentDto.email,
            errorDetails: ['Użytkownik istnieje już w bazie danych.'],
          });
          continue;
        }

        const password = generateRandomPwd();

        const newUser = new User();
        newUser.email = createStudentDto.email;
        newUser.role = Role.STUDENT;
        newUser.pwdHash = await hashPwd(password);
        await newUser.save();

        createdUsers.push({ newUser, password });

        newUser.student =
          await this.studentService.createInitialProfile(createStudentDto);
        await newUser.save();

        successfulEmails.push(createStudentDto.email);
      }
      await this.cacheManager.set('users-to-activate', createdUsers);
      await this.cacheManager.set('emails', [
        failedEmails,
        successfulEmails,
      ] as StudentEmails);

      return {
        successfulEmails,
        failedEmails,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new Error(e);
    }
  }

  async createRecruiter(createRecruiterDto: CreateHrRecruiterDto) {
    const createdUsers: UserWithRandomPwd[] = [];

    const password = generateRandomPwd();

    const newUser = new User();
    newUser.email = createRecruiterDto.email;
    newUser.role = Role.HR;
    newUser.pwdHash = await hashPwd(password);
    await newUser.save();

    createdUsers.push({ newUser, password });
    await this.cacheManager.set('users-to-activate', createdUsers);

    const recruiter = await this.hrRecruiterService.create(createRecruiterDto);

    newUser.recruiter = recruiter;
    await newUser.save();

    return { id: recruiter.id };
  }

  async sendActivationMail(
    users: UserWithRandomPwd[],
    studentEmails: StudentEmails,
  ) {
    const appPath = this.configService.get('APP_PATH');

    for await (const user of users) {
      const { email, id, activationToken } = user.newUser;
      await this.mailService.sendMail(
        email,
        'headhunter-app account activation',
        `<div><p>Aby aktywować swoje konto, kliknij poniższy link:</p>
        <a href="${appPath}/user/activate/${id}/${activationToken}">
          ${appPath}/user/activate/${id}/${activationToken}</a>
        <p>Twoje tymczasowe hasło: <strong>${user.password}</strong></p>
        <p>Po zalogowaniu się po raz pierwszy zalecamy zmianę hasła na bardziej bezpieczne.</p>
        <p>Dziękujemy za skorzystanie z naszej aplikacji!</p>
        <p>Z poważaniem,</p>
        <p>Zespół Head-Hunters v3 gr2</p></div>`,
      );
    }

    if (studentEmails) {
      const [failedEmails, successfulEmails] = studentEmails;
      console.error(failedEmails);
      return { failedEmails, successfulEmails };
    } else {
      const failedEmails: FailedEmails = [];
      const successfulEmails: SuccessfulEmails = [users[0].newUser.email];
      return { failedEmails, successfulEmails };
    }
  }

  async activateUser(id: string, activationToken: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException();
    if (user.activationToken !== activationToken)
      throw new ForbiddenException();

    user.isActive = true;
    user.activationToken = null;
    return await user.save();
  }

  async resetPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) throw new NotFoundException();

    const password = generateRandomPwd();
    user.pwdHash = await hashPwd(password);
    await user.save();

    await this.mailService.sendMail(
      email,
      'password reset',
      `
      <h3>Twoje hasło zostało zresetowane</h3>
      <p>Nowe hasło: <strong>${password}</strong></p>
      <p>Zalecamy zmianę hasła na nowe</p>
    `,
    );

    return { ok: true };
  }

  async changePassword(oldPwd: string, newPwd: string, user: UserFromReq) {
    const usr = await this.findOneById(user.userId);
    const isPasswordValid = await comparePwd(oldPwd, usr.pwdHash);
    if (!isPasswordValid)
      throw new ForbiddenException('Stare hasło jest nieprawidłowe.');

    usr.pwdHash = await hashPwd(newPwd);
    await usr.save();

    return { ok: true };
  }

  async validateStudentInitial(createStudentDto: CreateStudentInitialDto) {
    const student = plainToClass(CreateStudentInitialDto, createStudentDto);

    const errors = await validate(student);

    if (errors.length > 0) {
      const errorDetails = errors.map((error) => {
        return Object.values(error.constraints).join(', ');
      });

      return {
        isValid: false,
        errorDetails,
      };
    }

    return {
      isValid: true,
    };
  }

  async addAdmin(email: string, password: string) {
    const admin = new User();
    admin.email = email;
    admin.pwdHash = await hashPwd(password);
    admin.role = Role.ADMIN;
    admin.isActive = true;
    admin.activationToken = null;
    return await admin.save();
  }
}
