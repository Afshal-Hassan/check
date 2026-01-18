import { User } from './model';
import { OnboardingDTO } from './dto';
import { DeepPartial, EntityManager } from 'typeorm';
import { AppDataSource } from '@/config/data-source';
import * as InterestService from '@/modules/interest/service';
import * as LanguageService from '@/modules/language/service';
import * as UserPhotoService from '@/modules/user-photo/service';
import * as UserProfileService from '@/modules/user-profile/service';
import {
  save,
  getUsers,
  findUserByEmail,
  findActiveUserByEmail,
  updateLocationById,
  updatePasswordByEmail,
  findActiveUserByEmailAndRole,
  findUserAndProfilePictureById,
} from './repo';

export const getUserAndProfilePictureById = async (userId: string) => {
  return findUserAndProfilePictureById(userId);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return findUserByEmail(email);
};

export const getActiveUserByEmail = async (email: string): Promise<User | null> => {
  return findActiveUserByEmail(email);
};

export const getActiveUserByEmailAndRole = async (
  email: string,
  role: string,
): Promise<User | null> => {
  return findActiveUserByEmailAndRole(email, role);
};

export const getUsersList = async (isVerified: boolean, isSuspended: boolean): Promise<User[]> => {
  return getUsers(isVerified, isSuspended);
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return updatePasswordByEmail(email, hashedPassword);
};

export const completeOnboarding = async (data: OnboardingDTO) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const { userId, location, profile, interests } = data;

  try {
    const updatedUser = await updateUserLocation(userId, location, queryRunner.manager);

    const savedProfile = await UserProfileService.saveUserProfile(
      { userId, ...profile },
      queryRunner.manager,
    );

    await InterestService.saveInterests({ userId, interests }, queryRunner.manager);

    await LanguageService.saveLanguages({ userId, languages: data.languages }, queryRunner.manager);

    await queryRunner.commitTransaction();

    return {
      user: {
        ...updatedUser,
        passwordHash: undefined,
      },
      profile: savedProfile,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};

const updateUserLocation = async (userId: string, user: Partial<User>, manager: EntityManager) => {
  const { country, city, state } = user;

  return updateLocationById(userId, { country, city, state }, manager);
};

export const uploadProfilePictures = async (
  userId: string,
  files:
    | {
        profilePicture?: Express.MulterS3.File[];
        images?: Express.MulterS3.File[];
      }
    | undefined,
) => {
  const user = await getUserAndProfilePictureById(userId);

  if (!user) throw new Error('User not found');
  if (user.hasProfilePicture) throw new Error('You have already uploaded picture');

  if (!files) throw new Error('No files uploaded');

  const { profilePicture, images } = files || {};

  if (!profilePicture || profilePicture.length === 0) {
    throw new Error('Profile picture is required');
  }

  if (!images || images.length === 0) throw new Error('Atleast one image is required');

  const photos: {
    user: User;
    s3Key: string;
    isPrimary: boolean;
  }[] = [];

  photos.push({
    user: { id: userId } as DeepPartial<any>,
    s3Key: profilePicture?.[0].key,
    isPrimary: true,
  });

  images.forEach((image) => {
    photos.push({
      user: { id: userId } as DeepPartial<any>,
      s3Key: image.key,
      isPrimary: false,
    });
  });

  return UserPhotoService.savePhotos(photos);
};
