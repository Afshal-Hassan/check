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

export const findProfilePictureByUserId = async (userId: string): Promise<UserPhoto | null> => {
  return UserPhotoRepository.findOne({
    where: {
      user: { id: userId },
      isPrimary: true,
    },
  });
};
