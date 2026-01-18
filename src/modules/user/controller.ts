import * as UserService from './service';
import { Request, Response } from 'express';

export const getUsersList = async (req: Request, res: Response) => {
  try {
    const { isVerified, isSuspended } = req.query;

    const users = await UserService.getUsersList(isVerified === 'true', isSuspended === 'true');

    res.status(200).json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const onboarding = async (req: Request, res: Response) => {
  try {
    const result = await UserService.completeOnboarding(req.body);

    res.status(201).json({
      message: 'User onboarding complete successfully.',
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
