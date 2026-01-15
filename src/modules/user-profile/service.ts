import { save, updatePersonalDetailsById } from './repo';
import { PersonalDetailsDTO, UserProfileDTO } from './dto';

export const saveUserProfile = async (data: UserProfileDTO) => {
  // Translate bio for each language
  //   const translationPromises = TARGET_LANGUAGES.map(async (lang) => {
  //     const result = await translate(dto.bio, { to: lang });
  //     const translation: Partial<UserProfileTranslation> = {
  //       languageCode: lang,
  //       bio: result.text,
  //       heightCm: 0, // default, you can map from DTO
  //     };
  //     return translation;
  //   });

  //   const translations = await Promise.all(translationPromises);

  const translations = [{ languageCode: 'en', bio: data.bio, heightCm: 0, userId: data.userId }];

  const savedProfile = await save({
    ...data,
    translations,
  });

  return savedProfile;
};

export const updatePersonalDetailsByUserId = async (userId: string, data: PersonalDetailsDTO) => {
  const translations = [{ userId, languageCode: 'en', heightCm: data.heightCm, bio: '' }];

  return updatePersonalDetailsById(userId, {
    bodyType: data.bodyType,
    relationshipStatus: data.relationshipStatus,
    childrenPreference: data.childrenPreference,
    translations,
  });
};
