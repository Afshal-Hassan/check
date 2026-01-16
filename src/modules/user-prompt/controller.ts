import { Request, Response } from 'express';
import * as UserPromptService from './service';

export const saveUserPrompt = async (req: Request, res: Response) => {
  try {
    const result = await UserPromptService.saveUserPrompt(req.body);

    res.status(201).json({
      message: 'User prompt has been saved successfully.',
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
