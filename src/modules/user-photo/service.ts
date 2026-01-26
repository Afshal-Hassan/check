import { UserPhoto } from './model';
import { findProfilePictureByUserId, save, saveVerifiedPhoto } from './repo';

export const savePhotos = async (data: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  return save(data);
};

export const saveVerifiedPicture = async (data: Partial<UserPhoto>): Promise<UserPhoto> => {
  return saveVerifiedPhoto(data);
};

export const getProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findProfilePictureByUserId(userId);
};

// export const updateVerificationImageByUserId = async (
//   userId: string,
//   auditImage: Buffer,
// ): Promise<void> => {
//   await updateAuditImageByUserId(userId, auditImage);
// };
