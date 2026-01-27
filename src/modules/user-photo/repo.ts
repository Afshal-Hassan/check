import { EntityManager } from 'typeorm';
import { UserPhoto } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPhotoRepository = AppDataSource.getRepository(UserPhoto);

export const save = async (data: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  if (data.length === 0) return [];

  const userId = data[0].user?.id;

  if (userId) {
    await UserPhotoRepository.delete({ user: { id: userId } });
  }

  const photos = UserPhotoRepository.create(data);
  return UserPhotoRepository.save(photos);
};

export const saveVerifiedPhoto = async (
  data: Partial<UserPhoto>,
  manager: EntityManager,
): Promise<UserPhoto> => {
  const repo = manager.getRepository(UserPhoto);

  const photo = repo.create(data);
  return repo.save(photo);
};

export const findProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return UserPhotoRepository.findOne({
    where: {
      user: { id: userId },
      isPrimary: true,
    },
  });
};

export const findVerifiedPictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return UserPhotoRepository.findOne({
    where: {
      user: { id: userId },
      isVerified: true,
    },
  });
};
