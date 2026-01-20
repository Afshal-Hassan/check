import { AppError } from '.';

export class UnauthorizedException extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}
