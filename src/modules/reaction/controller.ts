import * as LikeService from './service';
import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import { REACTION_SUCCESS_MESSAGES } from './message';
import * as MessageUtil from '@/utils/message.util';

export const saveLike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await LikeService.saveLike(userId, req.body.reactionReceiverId, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(REACTION_SUCCESS_MESSAGES.LIKE.SAVE, languageCode),
      ...result,
    });
  } catch (err: any) {
    throw err;
  }
};

export const saveDislike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    await LikeService.saveDislike(userId, req.body.reactionReceiverId, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        REACTION_SUCCESS_MESSAGES.DISLIKE.SAVE,
        languageCode,
      ),
    });
  } catch (err: any) {
    throw err;
  }
};
