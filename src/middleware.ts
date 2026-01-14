import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';

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

export const validateDTO =
  (DTOClass: any) => async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DTOClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ errors: formatValidationErrors(errors) });
    }

    req.body = dto;
    next();
  };

const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.map((error) => ({
    field: error.property,
    message: Object.values(error.constraints || {}).join(', '),
  }));
};
