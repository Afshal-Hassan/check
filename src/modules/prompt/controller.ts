import { Request, Response } from 'express';
import * as UserPromptService from './service';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { PROMPT_SUCCESS_MESSAGES } from './message';

export const savePrompts = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserPromptService.savePrompts(req.body, languageCode);

    res.status(201).json({
      message: MessageUtil.getLocalizedMessage(PROMPT_SUCCESS_MESSAGES.SAVED, languageCode),
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
