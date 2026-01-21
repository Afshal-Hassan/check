import * as UserService from './service';
import { Request, Response } from 'express';
import { USER_SUCCESS_MESSAGES } from './message';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, isVerified, isSuspended } = req.query;

    const users = await UserService.getUsers(
      Number(page),
      isVerified === 'true',
      isSuspended === 'true',
    );

    res.status(200).json(users);
  } catch (err: any) {
    throw err;
  }
};

export const getUserDetailsByEmail = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserService.getUserDetailsByEmail(
      req.params.email as string,
      languageCode,
    );

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        USER_SUCCESS_MESSAGES.USER_DETAILS_RETRIEVED,
        languageCode,
      ),
      result,
    });
  } catch (err: any) {
    throw err;
  }
};

export const onboarding = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserService.completeOnboarding(req.body);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        USER_SUCCESS_MESSAGES.ONBOARDING_COMPLETE,
        languageCode,
      ),
      result,
    });
  } catch (err: any) {
    throw err;
  }
};

export const uploadProfilePictures = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const files = req.files as
      | {
          profilePicture?: Express.MulterS3.File[];
          images?: Express.MulterS3.File[];
        }
      | undefined;

    const result = await UserService.uploadProfilePictures(
      req.params.userId as string,
      files,
      languageCode,
    );

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(USER_SUCCESS_MESSAGES.IMAGES_UPLOADED, languageCode),
      result,
    });
  } catch (err: any) {
    throw err;
  }
};
