import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Request } from 'express';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import {
  FilteredStudents,
  OneStudentInitialResponse,
  OneStudentProfileResponse,
  Role,
  StudentFilters,
  StudentOrderByOptions,
  StudentStatus,
  UserFromReq,
} from 'src/types/';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles([Role.HR, Role.STUDENT])
  @Get('/initial/:email')
  findOneInitialProfile(
    @Param('email') email: string,
  ): Promise<OneStudentInitialResponse> {
    return this.studentService.findOneInitialProfile(email);
  }

  @Roles([Role.HR])
  @Get('/list/:status?/:page?/:take?')
  filterStudents(
    @Req() req: Request,
    @Param('status') status: unknown,
    @Param('page') page: unknown,
    @Param('take') take: unknown,
    @Query('orderBy') orderBy: StudentOrderByOptions,
    @Query('filters') filters: string,
  ): Promise<FilteredStudents> {
    const decodedFilters: StudentFilters = JSON.parse(
      decodeURIComponent(filters ?? null),
    );

    return this.studentService.filterAndSortStudents(
      page as number,
      take as number,
      status as StudentStatus,
      orderBy,
      decodedFilters,
      (req.user as UserFromReq).userId,
    );
  }

  @Roles([Role.HR, Role.STUDENT])
  @Get('/:id')
  findOneProfile(@Param('id') id: string): Promise<OneStudentProfileResponse> {
    return this.studentService.findOneProfile(id);
  }

  @Roles([Role.STUDENT])
  @Patch('/hired')
  markEmployed(@Req() req: Request): Promise<OneStudentInitialResponse> {
    return this.studentService.markEmployed((req.user as UserFromReq).userId);
  }

  @Roles([Role.STUDENT])
  @Post('/')
  createProfile(
    @Req() req: Request,
    @Body() studentDto: CreateStudentProfileDto,
  ): Promise<OneStudentProfileResponse> {
    return this.studentService.createStudentProfile(
      studentDto,
      (req.user as UserFromReq).userId,
    );
  }

  @Roles([Role.STUDENT])
  @Patch('/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentProfileDto,
  ): Promise<OneStudentProfileResponse> {
    return this.studentService.updateStudentProfile(id, updateStudentDto);
  }
}
