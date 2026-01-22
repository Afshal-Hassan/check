import * as PromptService from './service';
import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { PROMPT_SUCCESS_MESSAGES } from './message';

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await PromptService.getPrompts(languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(PROMPT_SUCCESS_MESSAGES.FETCH_LIST, languageCode),
      result: result,
    });
  } catch (err: any) {
    throw err;
  }
};
