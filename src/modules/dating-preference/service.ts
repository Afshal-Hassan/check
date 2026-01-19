import { findDatingPreferenceByUserId, save } from './repo';
import { DeepPartial } from 'typeorm';
import { DatingPreference } from './model';
import { DatingPreferenceDTO } from './dto';

export const getDatingPreferenceByUserId = async (
  userId: string,
): Promise<DatingPreference | null> => {
  return findDatingPreferenceByUserId(userId);
};

export const saveDatingPreference = async (
  data: DatingPreferenceDTO,
): Promise<DatingPreference> => {
  const datingPreference = await getDatingPreferenceByUserId(data.userId);

  if (datingPreference) throw new Error('Dating preference already saved');

  return save({
    user: { id: data.userId } as DeepPartial<any>,
    minAge: data.minAge,
    maxAge: data.maxAge,
    maxDistanceKm: data.maxDistanceKm,
    interestedIn: data.interestedIn,
    lookingFor: data.lookingFor,
  });
};
