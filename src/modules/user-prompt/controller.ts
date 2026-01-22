import { Request, Response } from 'express';
import * as UserPromptService from './service';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { USER_PROMPTS_SUCCESS_MESSAGES } from './message';

export const saveUserPrompts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserPromptService.saveUserPrompts(userId, req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(USER_PROMPTS_SUCCESS_MESSAGES.SAVED, languageCode),
      result,
    });
  } catch (err: any) {
    throw err;
  }
};
