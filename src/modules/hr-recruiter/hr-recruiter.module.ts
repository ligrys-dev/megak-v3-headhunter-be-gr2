import { Module, forwardRef } from '@nestjs/common';
import { HrRecruiterService } from './hr-recruiter.service';
import { HrRecruiterController } from './hr-recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './entities/hr-recruiter.entity';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => StudentModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Recruiter]),
  ],
  controllers: [HrRecruiterController],
  providers: [HrRecruiterService],
  exports: [HrRecruiterService],
})
export class HrRecruiterModule {}
