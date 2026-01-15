import { Request, Response } from 'express';
import * as DatingPreferenceService from './service';

export const saveDatingPreference = async (req: Request, res: Response) => {
  try {
    const result = await DatingPreferenceService.saveDatingPreference(req.body);
    res.status(200).json({
      message: 'Dating preference saved successfully.',
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
