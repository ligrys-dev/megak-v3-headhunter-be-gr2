import { Controller, Param, Patch, Req } from '@nestjs/common';
import { HrRecruiterService } from './hr-recruiter.service';
import { Request } from 'express';
import { OneStudentInitialResponse, Role, UserFromReq } from 'src/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('hr')
export class HrRecruiterController {
  constructor(private readonly hrRecruiterService: HrRecruiterService) {}

  @Roles([Role.HR])
  @Patch('/reserve/:email')
  reserveStudent(@Req() req: Request, @Param('email') email: string) {
    return this.hrRecruiterService.reserveStudent(
      email,
      (req.user as UserFromReq).userId,
    );
  }

  @Roles([Role.HR])
  @Patch('/available/:email')
  cancelReservation(
    @Req() req: Request,
    @Param('email') email: string,
  ): Promise<OneStudentInitialResponse> {
    return this.hrRecruiterService.cancelReservation(
      email,
      (req.user as UserFromReq).userId,
    );
  }

  @Roles([Role.HR])
  @Patch('/hire/:email')
  hireStudent(@Param('email') studentEmail: string) {
    return this.hrRecruiterService.hireStudent(studentEmail);
  }
}
