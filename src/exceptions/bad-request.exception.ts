import { AppError } from '.';

export class BadRequestException extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
