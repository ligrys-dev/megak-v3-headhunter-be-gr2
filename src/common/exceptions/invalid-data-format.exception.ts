import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDataFormatException extends HttpException {
  constructor(message?: string) {
    super(message || 'Invalid data format', HttpStatus.BAD_REQUEST);
  }
}
