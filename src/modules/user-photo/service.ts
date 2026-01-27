import { UserPhoto } from './model';
import { BadRequestException } from '@/exceptions';
import {
  findProfilePictureByUserId,
  findVerifiedPictureByUserId,
  save,
  saveVerifiedPhoto,
} from './repo';

export const savePhotos = async (data: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  return save(data);
};

export const saveVerifiedPicture = async (data: Partial<UserPhoto>): Promise<UserPhoto> => {
  return saveVerifiedPhoto(data);
};

export const getProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findProfilePictureByUserId(userId);
};

export const getVerifiedPictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findVerifiedPictureByUserId(userId);
};

// export const updateVerificationImageByUserId = async (
//   userId: string,
//   auditImage: Buffer,
// ): Promise<void> => {
//   await updateAuditImageByUserId(userId, auditImage);
// };
