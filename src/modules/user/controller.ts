import * as UserService from './service';
import { Request, Response } from 'express';
import { USER_ERROR_MESSAGES, USER_SUCCESS_MESSAGES } from './message';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { BadRequestException } from '@/exceptions';
import { feetInToCm } from '@/constants';

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

export const getUserDetailsById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId as string;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserService.getUserDetailsById(userId, languageCode);

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

export const getUsersWithSimilarFaces = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId as string;
    const languageCode = HeaderUtil.getLanguageCode(req);

    const { page = '1', interestedIn, minAge, maxAge, minHeight, maxHeight } = req.query;

    const filters = {
      page: Number(page),
      interestedIn: interestedIn as string | undefined,
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      minHeightCm: minHeight ? feetInToCm(Number(minHeight)) : undefined,
      maxHeightCm: maxHeight ? feetInToCm(Number(maxHeight)) : undefined,
      minHeightFt: minHeight ? Number(minHeight) : undefined,
      maxHeightFt: maxHeight ? Number(maxHeight) : undefined,
    };

    const result = await UserService.getUsersWithSimilarFaces(userId, languageCode, filters);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        USER_SUCCESS_MESSAGES.SIMILAR_USERS_RETRIEVED,
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
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await UserService.completeOnboarding(userId, req.body);

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
    const userId = (req as any).user?.userId;
    const languageCode = HeaderUtil.getLanguageCode(req);
    const files = req.files as
      | {
          profilePicture?: Express.MulterS3.File[];
          images?: Express.MulterS3.File[];
        }
      | undefined;

    const result = await UserService.uploadProfilePictures(userId as string, files, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(USER_SUCCESS_MESSAGES.IMAGES_UPLOADED, languageCode),
      result,
    });
  } catch (err: any) {
    throw err;
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const languageCode = HeaderUtil.getLanguageCode(req);
  const file = req.file as Express.Multer.File | undefined;

  try {
    const result = await UserService.verifyUser(userId as string, file, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(USER_SUCCESS_MESSAGES.USER_VERIFIED, languageCode),
      result,
    });
  } catch (err: any) {
    if (err.name === 'InvalidParameterException') {
      throw new BadRequestException(
        MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.IMAGE_PROCESSING_FAILED, languageCode),
      );
    }

    console.error('Error in verification:', err);
    throw err;
  }
};
