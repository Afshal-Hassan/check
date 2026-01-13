import * as OtpService from './service';
import { Request, Response } from 'express';

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    await OtpService.verifyOtp(req.body);

    res.status(200).json({ message: 'Otp verified' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
