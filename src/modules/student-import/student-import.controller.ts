import {
  Controller,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentImportService } from './student-import.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/types';

@Controller('/import')
export class StudentImportController {
  constructor(private readonly studentImportService: StudentImportService) {}

  @Roles([Role.ADMIN])
  @Post('/students')
  @Redirect('/user/students')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.studentImportService.parseFile(file);
  }
}
