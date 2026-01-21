import { User } from './model';
import { OnboardingDTO } from './dto';
import { DeepPartial, EntityManager } from 'typeorm';
import { USER_ERROR_MESSAGES } from './message';
import * as MessageUtil from '@/utils/message.util';
import { AppDataSource } from '@/config/data-source';
import * as InterestService from '@/modules/interest/service';
import * as UserPhotoService from '@/modules/user-photo/service';
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
  findUserAndProfilePictureById,
} from './repo';
import { BadRequestException } from '@/exceptions';
import { Role } from '@/modules/auth/enums';

export const getUserDetailsByEmail = async (email: string) => {
  const result = await findActiveUserByEmailAndRole(email, Role.User);

  return {
    id: result.userId,
    email: result.email,
    fullName: result.fullName,
    passwordHash: result.passwordHash,
    country: result.country,
    state: result.state,
    city: result.city,
    authType: result.authType,
    isVerified: result.isVerified,
    isSuspended: result.isSuspended,

    profile:
      result.bioEn === null
        ? null
        : {
            bioEn: result.bioEn,
            bioFr: result.bioFr,
            bioEs: result.bioEs,
            bioAr: result.bioAr,
            heightEn: result.heightEn,
            heightFr: result.heightFr,
            heightEs: result.heightEs,
            heightAr: result.heightAr,
            dateOfBirth: result.dateOfBirth,
            occupation: result.occupation,
            gender: result.gender,
            bodyType: result.bodyType,
            relationshipStatus: result.relationshipStatus,
            childrenPreference: result.childrenPreference,
          },

    interests: result.interests.length === 0 ? null : result.interests,

    lifestylePreference:
      result.smoking === null
        ? null
        : {
            smoking: result.smoking,
            politicalViews: result.politicalViews,
            diet: result.diet,
            workoutRoutine: result.workoutRoutine,
          },

    datingPreference:
      result.minAge === null
        ? null
        : {
            minAge: result.minAge,
            maxAge: result.maxAge,
            interestedIn: result.interestedIn,
            lookingFor: result.lookingFor,
          },

    prompts: result.prompts.length === 0 ? null : result.prompts,

    photos: result.photos.length === 0 ? null : result.photos,
  };
};

export const getUserAndProfilePictureById = async (userId: string) => {
  return findUserAndProfilePictureById(userId);
};

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
  const result = await findActiveUserByEmailAndRole(email, role);

  return {
    id: result.userId,
    email: result.email,
    fullName: result.fullName,
    passwordHash: result.passwordHash,
    country: result.country,
    state: result.state,
    city: result.city,
    authType: result.authType,
    isVerified: result.isVerified,
    isSuspended: result.isSuspended,

    profile:
      result.bioEn === null
        ? null
        : {
            bioEn: result.bioEn,
            bioFr: result.bioFr,
            bioEs: result.bioEs,
            bioAr: result.bioAr,
            heightEn: result.heightEn,
            heightFr: result.heightFr,
            heightEs: result.heightEs,
            heightAr: result.heightAr,
            dateOfBirth: result.dateOfBirth,
            occupation: result.occupation,
            gender: result.gender,
            bodyType: result.bodyType,
            relationshipStatus: result.relationshipStatus,
            childrenPreference: result.childrenPreference,
          },

    interests: result.interests.length === 0 ? null : result.interests,

    lifestylePreference:
      result.smoking === null
        ? null
        : {
            smoking: result.smoking,
            politicalViews: result.politicalViews,
            diet: result.diet,
            workoutRoutine: result.workoutRoutine,
          },

    datingPreference:
      result.minAge === null
        ? null
        : {
            minAge: result.minAge,
            maxAge: result.maxAge,
            interestedIn: result.interestedIn,
            lookingFor: result.lookingFor,
          },

    prompts: result.prompts.length === 0 ? null : result.prompts,

    photos: result.photos.length === 0 ? null : result.photos,
  };
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

export const completeOnboarding = async (data: OnboardingDTO) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const { userId, location, profile, interests } = data;

  try {
    const updatedUser = await updateUserLocation(userId, location, queryRunner.manager);

    const savedProfile: any = await UserProfileService.saveUserProfile(
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
      profile: {
        id: savedProfile.id,
        userId: savedProfile.user_id,

        bioEn: savedProfile.bio_en,
        bioFr: savedProfile.bio_fr,
        bioAr: savedProfile.bio_ar,
        bioEs: savedProfile.bio_es,

        heightEn: savedProfile.height_en,
        heightFr: savedProfile.height_fr,
        heightAr: savedProfile.height_ar,
        heightEs: savedProfile.height_es,

        dateOfBirth: savedProfile.date_of_birth,
        occupation: savedProfile.occupation,
        gender: savedProfile.gender,
        bodyType: savedProfile.body_type,
        relationshipStatus: savedProfile.relationship_status,
        childrenPreference: savedProfile.children_preference,
      },
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
  languageCode: string,
) => {
  if (!files)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.NO_FILES_UPLOADED, languageCode),
    );

  const { profilePicture, images } = files || {};

  if (!profilePicture || profilePicture.length === 0) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.PROFILE_PICTURE_REQUIRED, languageCode),
    );
  }

  if (!images || images.length === 0)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(
        USER_ERROR_MESSAGES.AT_LEAST_ONE_IMAGE_REQUIRED,
        languageCode,
      ),
    );

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
