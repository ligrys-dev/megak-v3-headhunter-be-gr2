import { Inject, Injectable } from '@nestjs/common';
import { InvalidDataFormatException } from 'src/common/exceptions/invalid-data-format.exception';
import * as Papa from 'papaparse';
import { Observable, Observer, firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { StudentInitialInterface } from 'src/types';

@Injectable()
export class StudentImportService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async parseFile(file: Express.Multer.File) {
    //TODO add type
    const uploadingFile = file.buffer.toString();

    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      const students: StudentInitialInterface[] = await firstValueFrom(
        new Observable((observer: Observer<any>) => {
          //TODO add type
          Papa.parse(uploadingFile, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
              observer.next(result.data);
              observer.complete();
            },
            error: (error: Error) => {
              observer.error(error);
            },
          });
        }),
      );

      const transformedData = students.map((student) => {
        if (student.bonusProjectUrls) {
          const bonusProjectUrlsArray = (
            student.bonusProjectUrls as unknown as string
          )
            .split(',')
            .map((url: string) => url.trim());
          return { ...student, bonusProjectUrls: bonusProjectUrlsArray };
        } else return { ...student };
      });

      await this.cacheManager.set('students', transformedData);
    } else if (file.mimetype === 'application/json') {
      const students = await JSON.parse(uploadingFile);
      await this.cacheManager.set('students', students);
    } else {
      throw new InvalidDataFormatException();
    }
  }
}
