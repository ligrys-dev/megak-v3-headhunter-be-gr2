import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentImportService } from './student-import.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/student-import')
export class StudentImportController {
  constructor(private readonly studentImportService: StudentImportService) {}

  @Post('/upload/csv')
  @UseInterceptors(FileInterceptor('file'))
  uploadCsvFile(@UploadedFile() file: Express.Multer.File) {
    return this.studentImportService.parseCsv(file);
  }

  @Post('/upload/json')
  @UseInterceptors(FileInterceptor('file'))
  uploadJsonFile(@UploadedFile() file: Express.Multer.File) {
    return this.studentImportService.parseJson(file);
  }
}
