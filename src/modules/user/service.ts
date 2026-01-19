import { User } from './model';
import { OnboardingDTO } from './dto';
import { EntityManager } from 'typeorm';
import { USER_ERROR_MESSAGES } from './message';
import * as MessageUtil from '@/utils/message.util';
import { AppDataSource } from '@/config/data-source';
import * as InterestService from '@/modules/interest/service';
import * as UserProfileService from '@/modules/user-profile/service';
import {
  save,
  findUserByEmail,
  findActiveUserByEmail,
  updateLocationById,
  updatePasswordByEmail,
  findActiveUserByEmailAndRole,
  findUserAndProfileById,
  findUsers,
} from './repo';

export const getUserAndProfileByUserId = async (userId: string) => {
  return findUserAndProfileById(userId);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return findUserByEmail(email);
};

export const getActiveUserByEmail = async (email: string): Promise<User | null> => {
  return findActiveUserByEmail(email);
};

export const getActiveUserByEmailAndRole = async (email: string, role: string) => {
  return findActiveUserByEmailAndRole(email, role);
};

export const getUsers = async (
  page: number,
  isVerified: boolean,
  isSuspended: boolean,
): Promise<User[]> => {
  const { data } = await findUsers(page, isVerified, isSuspended);
  return data;
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return updatePasswordByEmail(email, hashedPassword);
};

export const completeOnboarding = async (data: OnboardingDTO, languageCode: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const { userId, location, profile, interests } = data;

  try {
    const user = await getUserAndProfileByUserId(userId);

    if (user?.hasProfile)
      throw new Error(
        MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.PROFILE_ALREADY_SAVED, languageCode),
      );
    const updatedUser = await updateUserLocation(userId, location, queryRunner.manager);

    const savedProfile = await UserProfileService.saveUserProfile(
      { userId, ...profile },
      queryRunner.manager,
    );

    await InterestService.saveInterests({ userId, interests }, queryRunner.manager);

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
