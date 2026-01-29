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
  const bioEs = await GoogleTranslateUtil.translateText(data.bio, 'es');
  const bioAr = await GoogleTranslateUtil.translateText(data.bio, 'ar');

  return save(
    {
      user: { id: data.userId } as DeepPartial<any>,
      bioEn,
      bioFr,
      bioEs,
      bioAr,
      dateOfBirth: data.dateOfBirth,
      occupation: data.occupation,
      gender: data.gender,
    },
    manager,
  );
};

export const updatePersonalDetails = async (userId: string, data: PersonalDetailsDTO) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await LanguageService.saveLanguages({ userId, languages: data.languages }, queryRunner.manager);

    const updatedProfile: any = await updatePersonalDetailsByUserId(userId, {
      bodyType: data.bodyType,
      relationshipStatus: data.relationshipStatus,
      childrenPreference: data.childrenPreference,
      height: data.height,
      unit: data.unit,
    });

    await queryRunner.commitTransaction();

    return {
      profile: {
        id: updatedProfile.id,
        userId: updatedProfile.user_id,

        bioEn: updatedProfile.bio_en,
        bioFr: updatedProfile.bio_fr,
        bioAr: updatedProfile.bio_ar,
        bioEs: updatedProfile.bio_es,

        height: updatedProfile.height,
        unit: updatedProfile.unit,
        dateOfBirth: updatedProfile.date_of_birth,
        occupation: updatedProfile.occupation,
        gender: updatedProfile.gender,
        bodyType: updatedProfile.body_type,
        relationshipStatus: updatedProfile.relationship_status,
        childrenPreference: updatedProfile.children_preference,
      },
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};
