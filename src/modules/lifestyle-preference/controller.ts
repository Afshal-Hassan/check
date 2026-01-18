import { Request, Response } from 'express';
import * as LifestylePreferenceService from './service';

export const saveLifestylePreference = async (req: Request, res: Response) => {
  try {
    const result = await LifestylePreferenceService.saveLifestylePreference(req.body);

    res.status(201).json({
      message: 'Lifestyle preference saved successfully.',
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
