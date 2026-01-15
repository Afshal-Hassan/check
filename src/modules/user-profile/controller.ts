import { Request, Response } from 'express';
import * as UserProfileService from '@/modules/user-profile/service';

export const save = async (req: Request, res: Response) => {
  try {
    const result = await UserProfileService.saveUserProfile(req.body);

    res.status(201).json({
      message: 'User profile has been saved successfully.',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePersonalDetailsById = async (req: Request, res: Response) => {
  try {
    const result = await UserProfileService.updatePersonalDetailsByUserId(
      req.body.userId,
      req.body,
    );

    res.status(200).json({
      message: 'User personal details has been updated successfully.',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
