import { UserPhoto } from './model';
import {
  findProfilePictureByUserId,
  findVerifiedPictureByUserId,
  save,
  saveVerifiedPhoto,
} from './repo';
import { EntityManager } from 'typeorm';

export const savePhotos = async (data: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  return save(data);
};

export const saveVerifiedPicture = async (
  data: Partial<UserPhoto>,
  manager: EntityManager,
): Promise<UserPhoto> => {
  return saveVerifiedPhoto(data, manager);
};

export const getProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findProfilePictureByUserId(userId);
};

export const getVerifiedPictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return findVerifiedPictureByUserId(userId);
};
