export abstract class AppError extends Error {
  public readonly statusCode: number;

  protected constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export * from './not-found.exception';
export * from './bad-request.exception';
export * from './unauthorized.exception';
