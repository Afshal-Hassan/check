import * as AuthService from './service';
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signup(req.body);

    res.status(201).json({ message: 'OTP sent to email', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
