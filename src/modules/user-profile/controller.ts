import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import * as UserProfileService from '@/modules/user-profile/service';
import * as MessageUtil from '@/utils/message.util';
import { USER_PROFILE_SUCCESS_MESSAGES } from './message';

export const updatePersonalDetails = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserProfileService.updatePersonalDetails(req.body.userId, req.body);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(USER_PROFILE_SUCCESS_MESSAGES.UPDATED, languageCode),
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
