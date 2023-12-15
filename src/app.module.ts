import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { MailModule } from './common/mail/mail.module';
import { StudentImportModule } from './modules/student-import/student-import.module';
import { UserModule } from './modules/user/user.module';
import { StudentModule } from './modules/student/student.module';
import { CoreModule } from './common/core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { HrRecruiterModule } from './modules/hr-recruiter/hr-recruiter.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    StudentImportModule,
    StudentModule,
    HrRecruiterModule,
    CoreModule,
    AuthModule,
    MailModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
