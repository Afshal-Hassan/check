import { User } from './model';
import { OnboardingDTO } from './dto';
import { S3Util } from '@/utils/s3.util';
import { USER_ERROR_MESSAGES } from './message';
import { BadRequestException } from '@/exceptions';
import * as MessageUtil from '@/utils/message.util';
import { DeepPartial, EntityManager } from 'typeorm';
import { AppDataSource } from '@/config/data-source';
import * as RekognitionUtil from '@/utils/rekognition.util';
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
  findUsers,
  findUserAndProfilePictureById,
  findActiveUserById,
  findActiveUsersById,
  findUserAndVerifiedPictureById,
  updateIsVerifiedById,
  updateIsOnboardedById,
} from './repo';

export const getUsers = async (page: number, isVerified: boolean, isSuspended: boolean) => {
  const result = await findUsers(page, isVerified, isSuspended);

  const total = result.length > 0 ? Number(result[0].total_count) : 0;

  const data = result.map((r) => ({
    userId: r.userId,
    email: r.email,
    gender: r.gender,
    occupation: r.occupation,
    age: Number(r.age),
  }));

  return { data, total };
};

export const getUserDetailsById = async (userId: string, languageCode: string) => {
  const result = await findActiveUserById(userId);

  if (!result)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.USER_NOT_FOUND, languageCode),
    );

  if (result.isSuspended)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.ACCOUNT_SUSPENDED, languageCode),
    );

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
    isOnboarded: result.isOnboarded,
    isSuspended: result.isSuspended,

    profile:
      result.bioEn === null
        ? null
        : {
            bioEn: result.bioEn,
            bioFr: result.bioFr,
            bioEs: result.bioEs,
            bioAr: result.bioAr,
            dateOfBirth: result.dateOfBirth,
            occupation: result.occupation,
            gender: result.gender,
          },

    personalDetail:
      result.height === null
        ? null
        : {
            height: result.height,
            unit: result.unit,
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

export const getUsersWithSimilarFaces = async (
  userId: string,
  languageCode: string,
  filters: {
    page?: number;
    interestedIn?: string;
    minAge?: number;
    maxAge?: number;
    minHeightCm?: number;
    maxHeightCm?: number;
    minHeightFt?: number;
    maxHeightFt?: number;
  },
) => {
  const user = await getUserAndVerifiedPictureById(userId);

  if (!user || !user.hasVerifiedPicture)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.USER_NOT_FOUND, languageCode),
    );

  const similarUsers = await RekognitionUtil.searchUsersWithSimilarFaces(
    userId,
    user.verifiedPicture?.s3Key,
  );

  const similarUserIds = similarUsers.map((u) => u.userId!);

  const otherUsers = await RekognitionUtil.getAllOtherRemainingUsersInCollection(
    userId,
    similarUserIds,
  );

  const allUserIds = [...similarUserIds, ...otherUsers.map((u) => u.userId!)];

  console.log(allUserIds);

  const users = await findActiveUsersById(userId, allUserIds, filters);

  return users.map((user: any) => {
    const similarUser = similarUsers.find((u) => u.userId === user.userId);

    return {
      id: user.userId,
      email: user.email,
      fullName: user.fullName,
      country: user.country,
      state: user.state,
      city: user.city,
      authType: user.authType,
      isVerified: user.isVerified,
      isOnboarded: user.isOnboarded,
      isSuspended: user.isSuspended,
      matchScore: similarUser?.similarity || 0,

      profile:
        user.bioEn === null
          ? null
          : {
              bioEn: user.bioEn,
              bioFr: user.bioFr,
              bioEs: user.bioEs,
              bioAr: user.bioAr,
              dateOfBirth: user.dateOfBirth,
              occupation: user.occupation,
              gender: user.gender,
            },

      personalDetail:
        user.height === null
          ? null
          : {
              height: user.height,
              unit: user.unit,
              bodyType: user.bodyType,
              relationshipStatus: user.relationshipStatus,
              childrenPreference: user.childrenPreference,
            },

      interests: user.interests?.length ? user.interests : null,

      lifestylePreference:
        user.smoking === null
          ? null
          : {
              smoking: user.smoking,
              politicalViews: user.politicalViews,
              diet: user.diet,
              workoutRoutine: user.workoutRoutine,
            },

      datingPreference:
        user.minAge === null
          ? null
          : {
              minAge: user.minAge,
              maxAge: user.maxAge,
              interestedIn: user.interestedIn,
              lookingFor: user.lookingFor,
            },

      prompts: user.prompts?.length ? user.prompts : null,

      photos: user.photos?.length ? user.photos : null,
    };
  });
};

export const completeOnboarding = async (userId: string, data: OnboardingDTO) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const { location, profile, interests } = data;

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

        height: savedProfile.height,
        unit: savedProfile.unit,
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

  const detectResponse = await RekognitionUtil.detectFace(profilePicture?.[0].key);

  if (!detectResponse.FaceDetails || detectResponse.FaceDetails.length === 0) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(
        USER_ERROR_MESSAGES.NO_FACE_DETECTED_IN_PROFILE_IMAGE,
        languageCode,
      ),
    );
  }

  const photos: {
    user: User;
    s3Key: string;
    isPrimary?: boolean;
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
    });
  });

  return UserPhotoService.savePhotos(photos);
};

export const verifyUser = async (
  userId: string,
  file: Express.Multer.File | undefined,
  languageCode: string,
) => {
  if (!file) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(
        USER_ERROR_MESSAGES.NO_VERIFICATION_IMAGE_UPLOADED,
        languageCode,
      ),
    );
  }

  const verificationImageBuffer = file.buffer;

  const verifiedPicture = await UserPhotoService.getVerifiedPictureByUserId(userId);

  if (verifiedPicture) {
    throw new BadRequestException('You are already verified');
  }

  const profilePicture = await UserPhotoService.getProfilePictureByUserId(userId);

  if (!profilePicture) {
    throw new Error(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.PROFILE_PICTURE_REQUIRED, languageCode),
    );
  }

  /* ---------- Rekognition  ---------- */

  const detectResponse = await RekognitionUtil.detectFace(verificationImageBuffer);

  if (!detectResponse.FaceDetails || detectResponse.FaceDetails.length === 0) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.NO_FACE_DETECTED, languageCode),
    );
  }

  const response: any = await RekognitionUtil.compareFace(
    {
      userId,
      sourceImageKey: profilePicture.s3Key,
      verificationImageBuffer,
    },
    languageCode,
  );

  /* ---------- S3 UPLOAD ---------- */

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const s3Key = await S3Util.uploadFile(
      `users/${userId}/verification`,
      verificationImageBuffer,
      file.mimetype,
    );

    await UserPhotoService.saveVerifiedPicture(
      {
        user: { id: userId } as DeepPartial<any>,
        s3Key,
        isVerified: true,
      },
      queryRunner.manager,
    );

    await markUserAsVerifiedById(userId, queryRunner.manager);
    await markUserAsOnboardedById(userId, queryRunner.manager);

    await queryRunner.commitTransaction();

    return {
      similarity: response.FaceMatches[0].Similarity,
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getUserAndProfilePictureById = async (userId: string) => {
  const result = await findUserAndProfilePictureById(userId);

  if (!result) return null;

  return {
    id: result.user_id,
    hasProfilePicture: !!result.photo_id,
    profilePicture: result.photo_id
      ? {
          id: result.photo_id,
          userId: result.user_id,
          s3Key: result.s3_key,
          isPrimary: result.is_primary,
        }
      : null,
  };
};

export const getUserAndVerifiedPictureById = async (userId: string) => {
  const result = await findUserAndVerifiedPictureById(userId);

  if (!result) return null;

  return {
    id: result.user_id,
    hasVerifiedPicture: !!result.photo_id,
    verifiedPicture: result.photo_id
      ? {
          id: result.photo_id,
          userId: result.user_id,
          s3Key: result.s3_key,
          isVerified: result.is_verified,
        }
      : null,
  };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return findUserByEmail(email);
};

export const getActiveUserByEmail = async (email: string): Promise<User | null> => {
  return findActiveUserByEmail(email);
};

export const getActiveUserByEmailAndRole = async (email: string, role: string) => {
  const result = await findActiveUserByEmailAndRole(email, role);

  if (!result) return null;

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
    isOnboarded: result.isOnboarded,
    isSuspended: result.isSuspended,

    profile:
      result.bioEn === null
        ? null
        : {
            bioEn: result.bioEn,
            bioFr: result.bioFr,
            bioEs: result.bioEs,
            bioAr: result.bioAr,
            dateOfBirth: result.dateOfBirth,
            occupation: result.occupation,
            gender: result.gender,
          },

    personalDetail:
      result.height === null
        ? null
        : {
            height: result.height,
            unit: result.unit,
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

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return updatePasswordByEmail(email, hashedPassword);
};

const updateUserLocation = async (userId: string, user: Partial<User>, manager: EntityManager) => {
  const { country, city, state } = user;

  return updateLocationById(userId, { country, city, state }, manager);
};

const markUserAsVerifiedById = async (userId: string, manager: EntityManager) => {
  return updateIsVerifiedById(userId, manager);
};

const markUserAsOnboardedById = async (userId: string, manager: EntityManager) => {
  return updateIsOnboardedById(userId, manager);
};
