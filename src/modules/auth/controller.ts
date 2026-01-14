import * as AuthService from './service';
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signup(req.body);

    res
      .status(200)
      .json({ message: 'A One-Time Password (OTP) has been sent to your email.', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const save = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.save(req.body);

    res.status(201).json({ message: 'User has been saved', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.forgotPassword(req.body);

    res.status(200).json({
      message:
        'A One-Time Password (OTP) has been sent to your email. Please enter it to proceed with the password reset.',
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await AuthService.resetPassword(req.body);

    res.status(200).json({
      message:
        'Your password has been successfully updated. Please proceed to log in with your new credentials.',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
