import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';

export const globalErrorHandler = (err: any, _: Request, res: Response, __: NextFunction) => {
  const statusCode = err.statusCode || err.status || 400;
  const message = err.message || 'Something went wrong';

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

export const formatValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): { field: string; message: string }[] => {
  const result: { field: string; message: string }[] = [];

  for (const error of errors) {
    const fieldPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      result.push({
        field: fieldPath,
        message: Object.values(error.constraints).join(', '),
      });
    }

    if (error.children && error.children.length > 0) {
      result.push(...formatValidationErrors(error.children, fieldPath));
    }
  }

  return result;
};
