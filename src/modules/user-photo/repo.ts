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

export const saveVerifiedPhoto = async (data: Partial<UserPhoto>): Promise<UserPhoto> => {
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

// export const updateAuditImageByUserId = async (
//   userId: string,
//   auditImage: Buffer,
// ): Promise<void> => {
//   await UserPhotoRepository.update(
//     { user: { id: userId } },
//     {
//       auditImage: auditImage,
//     },
//   );
// };
