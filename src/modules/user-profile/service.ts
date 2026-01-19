import { UserProfile } from './model';
import { GenderEnum } from '@/constants';
import { PersonalDetailsDTO } from './dto';
import { DeepPartial, EntityManager } from 'typeorm';
import { AppDataSource } from '@/config/data-source';
import { save, updatePersonalDetailsByUserId } from './repo';
import * as LanguageService from '@/modules/language/service';
import * as GoogleTranslateUtil from '@/utils/google-translate.util';

export const saveUserProfile = async (
  data: {
    userId: string;
    bio: string;
    dateOfBirth: Date;
    occupation: string;
    gender: GenderEnum;
  },
  manager: EntityManager,
): Promise<UserProfile> => {
  const bioEn = await GoogleTranslateUtil.translateText(data.bio, 'en');
  const bioFr = await GoogleTranslateUtil.translateText(data.bio, 'fr');
  const bioSp = await GoogleTranslateUtil.translateText(data.bio, 'es');
  const bioAr = await GoogleTranslateUtil.translateText(data.bio, 'ar');

  return save(
    {
      user: { id: data.userId } as DeepPartial<any>,
      bioEn,
      bioFr,
      bioSp,
      bioAr,
      dateOfBirth: data.dateOfBirth,
      occupation: data.occupation,
      gender: data.gender,
    },
    manager,
  );
};

export const updatePersonalDetails = async (
  userId: string,
  data: PersonalDetailsDTO,
): Promise<UserProfile> => {
  const heightEn = await GoogleTranslateUtil.translateText(data.height, 'en');
  const heightFr = await GoogleTranslateUtil.translateText(data.height, 'fr');
  const heightSp = await GoogleTranslateUtil.translateText(data.height, 'es');
  const heightAr = await GoogleTranslateUtil.translateText(data.height, 'ar');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await LanguageService.saveLanguages({ userId, languages: data.languages }, queryRunner.manager);

    const updatedProfile = await updatePersonalDetailsByUserId(userId, {
      bodyType: data.bodyType,
      relationshipStatus: data.relationshipStatus,
      childrenPreference: data.childrenPreference,
      heightEn,
      heightFr,
      heightSp,
      heightAr,
    });

    await queryRunner.commitTransaction();

    return updatedProfile;
  } catch (error) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};
