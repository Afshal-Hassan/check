import { User } from './model';
import { OnboardingDTO } from './dto';
import { USER_ERROR_MESSAGES, USER_SUCCESS_MESSAGES } from './message';
import { generateRequestToken, toBase64 } from '@/constants';
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
} from './repo';
import {
  CompareFacesCommand,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
} from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '@/config/aws-rekognition.config';
import { S3Util } from '@/utils/s3.util';

export const getUsersWithSimilarFaces = async (
  userId: string,
  languageCode: string,
  page: number,
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

  const users = await findActiveUsersById(allUserIds, page);

  return users.map((user) => {
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
        user.heightEn === null
          ? null
          : {
              heightEn: user.heightEn,
              heightFr: user.heightFr,
              heightEs: user.heightEs,
              heightAr: user.heightAr,
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
      result.heightEn === null
        ? null
        : {
            heightEn: result.heightEn,
            heightFr: result.heightFr,
            heightEs: result.heightEs,
            heightAr: result.heightAr,
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
      result.heightEn === null
        ? null
        : {
            heightEn: result.heightEn,
            heightFr: result.heightFr,
            heightEs: result.heightEs,
            heightAr: result.heightAr,
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

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return updatePasswordByEmail(email, hashedPassword);
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

export const createLivenessSession = async (clientRequestToken?: string) => {
  const command = new CreateFaceLivenessSessionCommand({
    ClientRequestToken: clientRequestToken || generateRequestToken(),
  });

  const response = await rekognitionClient.send(command);

  return {
    sessionId: response.SessionId,
  };
};

export const getLivenessSession = async (userId: string, sessionId: string) => {
  if (!sessionId) {
    throw new BadRequestException('Session ID is required');
  }

  const command = new GetFaceLivenessSessionResultsCommand({
    SessionId: sessionId,
  });

  const response = await rekognitionClient.send(command);

  const firstAuditImage = response.AuditImages?.[0];

  if (firstAuditImage?.Bytes) {
    const auditImageBuffer = Buffer.from(firstAuditImage.Bytes);
    // await UserPhotoService.updateVerificationImageByUserId(userId, auditImageBuffer);

    // await RekognitionUtil.indexFaces(userId, auditImageBuffer);
  }

  return {
    success: true,
    result: {
      sessionId: response.SessionId,
      status: response.Status,
      confidence: response.Confidence,
      isLive: response.Status === 'SUCCEEDED',
      auditImage: firstAuditImage?.Bytes,
      response: response,
    },
  };
};

export const verifyUser = async (
  userId: string,
  file: Express.Multer.File | undefined,

  languageCode: string,
) => {
  if (!file)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(
        USER_ERROR_MESSAGES.NO_VERIFICATION_IMAGE_UPLOADED,
        languageCode,
      ),
    );

  const verificationImageBuffer = file.buffer;

  const verifiedPicture = await UserPhotoService.getVerifiedPictureByUserId(userId);

  if (verifiedPicture) throw new BadRequestException('Verified picture is already saved.');

  const profilePicture = await UserPhotoService.getProfilePictureByUserId(userId);

  if (!profilePicture) throw new Error('User profile picture not found');

  const sourceImageKey = profilePicture.s3Key;

  const sourceImageBuffer = await RekognitionUtil.s3ObjectToBuffer(sourceImageKey);

  const command = new CompareFacesCommand({
    SourceImage: { Bytes: sourceImageBuffer },
    TargetImage: { Bytes: verificationImageBuffer },
    SimilarityThreshold: 60,
  });

  const response = await rekognitionClient.send(command);

  if (response.FaceMatches && response.FaceMatches.length > 0) {
    const key = await S3Util.uploadFile(
      `users/${userId}/verification`,
      verificationImageBuffer,
      file.mimetype,
    );

    await RekognitionUtil.indexFaces(userId, key);

    await UserPhotoService.saveVerifiedPicture({
      user: { id: userId } as DeepPartial<any>,
      s3Key: key,
      isVerified: true,
    });

    return {
      message: MessageUtil.getLocalizedMessage(USER_SUCCESS_MESSAGES.USER_VERIFIED, languageCode),
      similarity: response.FaceMatches[0].Similarity,
    };
  } else {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.USER_VERIFICATION_FAILED, languageCode),
    );
  }
};
