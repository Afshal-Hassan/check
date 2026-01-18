import { Request, Response } from 'express';
import * as UserProfileService from '@/modules/user-profile/service';

export const updatePersonalDetails = async (req: Request, res: Response) => {
  try {
    const result = await UserProfileService.updatePersonalDetails(req.body.userId, req.body);

    res.status(200).json({
      message: 'User personal details has been updated successfully.',
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
