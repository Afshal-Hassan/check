import { S3Util } from '@/utils/s3.util';
import * as UserService from './service';
import { USER_ERROR_MESSAGES } from './message';
import { NotFoundException } from '@/exceptions';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';

export const deleteOldFilesFromS3 = async (req: any, _: any, next: any) => {
  const userId = req.params.userId;
  const languageCode = HeaderUtil.getLanguageCode(req);

  const user = await UserService.getUserAndProfilePictureById(userId);

  if (!user)
    throw new NotFoundException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.USER_NOT_FOUND, languageCode),
    );

  if (user.hasProfilePicture) await S3Util.deleteFolder(`users/${userId}/`);

  next();
};
