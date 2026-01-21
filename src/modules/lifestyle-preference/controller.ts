import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import * as LifestylePreferenceService from './service';
import { LIFESTYLE_PREFERENCE_SUCCESS_MESSAGES } from './message';

export const saveLifestylePreference = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await LifestylePreferenceService.saveLifestylePreference(req.body);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        LIFESTYLE_PREFERENCE_SUCCESS_MESSAGES.SAVED,
        languageCode,
      ),
      ...result,
    });
  } catch (err: any) {
    throw err;
  }
};
