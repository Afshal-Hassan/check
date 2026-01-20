import { UserPhoto } from './model';
import { findProfilePictureByUserId, save } from './repo';

export const savePhotos = async (data: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  return save(data);
};

export const getProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findProfilePictureByUserId(userId);
};
