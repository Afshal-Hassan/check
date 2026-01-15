import { save, updatePersonalDetailsByUserId } from './repo';
import { PersonalDetailsDTO, UserProfileDTO } from './dto';
import { DeepPartial } from 'typeorm';

export const saveUserProfile = async (data: UserProfileDTO) => {
  return save({
    user: { id: data.userId } as DeepPartial<any>,
    bioEn: data.bio,
    bioFr: data.bio,
    bioSp: data.bio,
    bioAr: data.bio,
    dateOfBirth: data.dateOfBirth,
    occupation: data.occupation,
    gender: data.gender,
  });
};

export const updatePersonalDetails = async (userId: string, data: PersonalDetailsDTO) => {
  return updatePersonalDetailsByUserId(userId, {
    bodyType: data.bodyType,
    relationshipStatus: data.relationshipStatus,
    childrenPreference: data.childrenPreference,
    heightEn: data.height,
    heightFr: data.height,
    heightSp: data.height,
    heightAr: data.height,
  });
};
