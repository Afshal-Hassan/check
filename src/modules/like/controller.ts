import * as LikeService from './service';
import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import { LIKE_SUCCESS_MESSAGES } from './message';
import * as MessageUtil from '@/utils/message.util';

export const saveUserLike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await LikeService.saveUserLike(userId, req.body.likerId);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(LIKE_SUCCESS_MESSAGES.SAVED, languageCode),
      ...result,
    });
  } catch (err: any) {
    throw err;
  }
};
