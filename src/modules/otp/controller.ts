import * as AuthService from './service';
import { Request, Response } from 'express';

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await AuthService.verifyOtp(email, otp);

    res.status(200).json({ message: 'User verified', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
