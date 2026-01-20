import { Request } from 'express';

export const getLanguageCode = (req: Request): string => {
  return req.headers['accept-language'] || 'en';
};
