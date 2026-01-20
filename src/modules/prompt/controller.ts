import * as PromptService from './service';
import { Request, Response } from 'express';
import * as MessageUtil from '@/utils/message.util';
import * as HeaderUtil from '@/utils/header.util';
import { PROMPT_SUCCESS_MESSAGES } from './message';

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await PromptService.getPrompts();

    res.status(201).json({
      message: MessageUtil.getLocalizedMessage(PROMPT_SUCCESS_MESSAGES.FETCH_LIST, languageCode),
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
