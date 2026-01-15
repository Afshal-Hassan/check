import { Request, Response } from 'express';
import * as InterestService from '@/modules/interest/service';

export const save = async (req: Request, res: Response) => {
  try {
    const result = await InterestService.saveInterests(req.body);

    res.status(200).json({
      message: 'User interests has been saved successfully.',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
