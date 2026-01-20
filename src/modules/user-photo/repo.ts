import { AppDataSource } from '@/config/data-source';
import { UserPhoto } from './model';

export const UserPhotoRepository = AppDataSource.getRepository(UserPhoto);

export const save = async (userPhotosData: Partial<UserPhoto>[]): Promise<UserPhoto[]> => {
  const userPhotos = UserPhotoRepository.create(userPhotosData);
  return UserPhotoRepository.save(userPhotos);
};

export const findProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return UserPhotoRepository.findOne({
    where: {
      user: { id: userId },
      isPrimary: true,
    },
  });
};
