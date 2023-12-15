import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserService } from './user.service';
import { CreateHrRecruiterDto } from '../hr-recruiter/dto/create-hr-recruiter.dto';
import { CreateStudentInitialDto } from '../student/dto/create-student-initial.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Role, StudentEmails, UserFromReq, UserWithRandomPwd } from 'src/types';
import { config } from 'dotenv';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsePassword } from 'src/common/decorators/use-password.decorator';
import { PasswordProtectGuard } from 'src/common/guards/password-protected.guard';
config();

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/')
  getSelf(@Req() req: Request) {
    return this.userService.getSelf((req.user as UserFromReq).userId);
  }

  @Roles([Role.ADMIN])
  @Get('/students')
  @Redirect('/user/sendActivationMail')
  async createStudentUsers() {
    const createStudentDtos: CreateStudentInitialDto[] =
      await this.cacheManager.get('students');
    return this.userService.createStudents(createStudentDtos);
  }
  @Roles([Role.ADMIN])
  @Post('/recruiter')
  @Redirect('/user/sendActivationMail')
  createRecruiterUser(@Body() createRecruiterDto: CreateHrRecruiterDto) {
    return this.userService.createRecruiter(createRecruiterDto);
  }

  @Roles([Role.ADMIN])
  @Get('/sendActivationMail')
  async sendActivationMail() {
    const users: UserWithRandomPwd[] =
      await this.cacheManager.get('users-to-activate');
    const studentEmails: StudentEmails = await this.cacheManager.get('emails');

    return this.userService.sendActivationMail(users, studentEmails);
  }

  @Public()
  @Redirect(process.env.CORS_ORIGIN)
  @Get('/activate/:id/:activationToken')
  activateUser(
    @Param('id') id: string,
    @Param('activationToken') activationToken: string,
  ) {
    return this.userService.activateUser(id, activationToken);
  }

  @Patch('/change-pass')
  changePassword(
    @Req() req: Request,
    @Body('oldPwd') oldPwd: string,
    @Body('newPwd') newPwd: string,
  ) {
    return this.userService.changePassword(
      oldPwd,
      newPwd,
      req.user as UserFromReq,
    );
  }

  @Public()
  @Patch('/reset-pass')
  resetPassword(@Body('email') email: string) {
    return this.userService.resetPassword(email);
  }

  @Post('/admin')
  @Public()
  @UseGuards(PasswordProtectGuard)
  @UsePassword(process.env.CREATE_ADMIN_PASS)
  addAdmin(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.addAdmin(email, password);
  }
}
