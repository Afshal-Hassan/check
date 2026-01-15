import { UserProfile } from './model';
import { AppDataSource } from '@/config/data-source';
import { UserProfileTranslation } from './model.translation';

export const UserProfileRepository = AppDataSource.getRepository(UserProfile);

export const save = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  return AppDataSource.transaction(async (manager) => {
    const UserProfileRepo = manager.getRepository(UserProfile);
    const TranslationRepo = manager.getRepository(UserProfileTranslation);

    const profile = UserProfileRepo.create({
      userId: data.userId,
      dateOfBirth: data.dateOfBirth,
      occupation: data.occupation,
      gender: data.gender,
    });

    const savedProfile = await UserProfileRepo.save(profile);

    if (data.translations && data.translations.length > 0) {
      const translations = data.translations.map(({ languageCode, bio }) => {
        const translation = TranslationRepo.create({
          bio: bio!,
          languageCode: languageCode!,
          userProfile: savedProfile,
        });
        return translation;
      });

      await TranslationRepo.save(translations);

      savedProfile.translations = translations;
    }

    return savedProfile;
  });
};

export const updatePersonalDetailsById = async (
  userId: string,
  data: Partial<UserProfile>,
): Promise<UserProfile> => {
  return AppDataSource.transaction(async (manager) => {
    const UserProfileRepo = manager.getRepository(UserProfile);
    const TranslationRepo = manager.getRepository(UserProfileTranslation);

    const { translations, ...profileData } = data;

    const profile = await UserProfileRepo.preload({
      userId,
      ...profileData,
    });

    if (!profile) {
      throw new Error('User profile not found');
    }

    /* Update profile fields */
    if (profileData.bodyType !== undefined) profile.bodyType = profileData.bodyType;

    if (profileData.relationshipStatus !== undefined)
      profile.relationshipStatus = profileData.relationshipStatus;

    if (profileData.childrenPreference !== undefined)
      profile.childrenPreference = profileData.childrenPreference;

    await UserProfileRepo.save(profile);

    /* Update HEIGHT ONLY */
    if (translations?.length) {
      const existingTranslations = await TranslationRepo.find({
        where: { userProfile: { userId } },
        relations: ['userProfile'],
      });

      const toSave = translations
        .filter((t) => t.heightCm !== undefined)
        .map((t) => {
          const existing = existingTranslations.find((e) => e.languageCode === t.languageCode);

          if (!existing) {
            return TranslationRepo.create({
              userProfile: profile,
              languageCode: t.languageCode!,
              heightCm: t.heightCm!,
            });
          }

          existing.heightCm = t.heightCm!;
          return existing;
        });

      if (toSave.length) {
        await TranslationRepo.save(toSave);
      }
    }

    return profile;
  });
};
