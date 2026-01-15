import * as UserService from './service';
import { Request, Response } from 'express';

export const updateUserLocationById = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateUserLocationById(req.body);

    res.status(200).json({
      message: 'User location updated successfully.',
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
