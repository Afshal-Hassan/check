import { DeepPartial } from 'typeorm';
import { DatingPreference } from './model';
import { DatingPreferenceDTO } from './dto';
import { findDatingPreferenceByUserId, save } from './repo';

export const getDatingPreferenceByUserId = async (
  userId: string,
): Promise<DatingPreference | null> => {
  return findDatingPreferenceByUserId(userId);
};

export const saveDatingPreference = async (userId: string, data: DatingPreferenceDTO) => {
  const datingPreference: any = await save({
    user: { id: userId } as DeepPartial<any>,
    minAge: data.minAge,
    maxAge: data.maxAge,
    interestedIn: data.interestedIn,
    lookingFor: data.lookingFor,
  });

  return {
    id: datingPreference.id,
    minAge: datingPreference.min_age,
    maxAge: datingPreference.max_age,
    interestedIn: datingPreference.interested_in,
    lookingFor: datingPreference.looking_for,
  };
};
