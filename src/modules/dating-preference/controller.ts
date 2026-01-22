import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import * as DatingPreferenceService from './service';
import { DATING_PREFERENCE_SUCCESS_MESSAGES } from './message';

export const saveDatingPreference = async (req: Request, res: Response) => {
  try {
    const userId = (req as any)?.user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await DatingPreferenceService.saveDatingPreference(userId, req.body);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        DATING_PREFERENCE_SUCCESS_MESSAGES.SAVED,
        languageCode,
      ),
      ...result,
    });
  } catch (err: any) {
    throw err;
  }
};
