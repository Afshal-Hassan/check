import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, _: Request, res: Response, __: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  console.error(err);
  res.status(statusCode).json(errorResponse);
};
