import { DeepPartial } from 'typeorm';
import { DatingPreference } from './model';
import { DatingPreferenceDTO } from './dto';
import { findDatingPreferenceByUserId, save } from './repo';

export const getDatingPreferenceByUserId = async (
  userId: string,
): Promise<DatingPreference | null> => {
  return findDatingPreferenceByUserId(userId);
};

export const saveDatingPreference = async (
  data: DatingPreferenceDTO,
): Promise<DatingPreference> => {
  return save({
    user: { id: data.userId } as DeepPartial<any>,
    minAge: data.minAge,
    maxAge: data.maxAge,
    interestedIn: data.interestedIn,
    lookingFor: data.lookingFor,
  });
};
