import { DeepPartial } from 'typeorm';
import { DatingPreferenceDTO } from './dto';
import { DatingPreference } from './model';
import { save } from './repo';

export const saveDatingPreference = async (
  data: DatingPreferenceDTO,
): Promise<DatingPreference> => {
  return save({
    user: { id: data.userId } as DeepPartial<any>,
    minAge: data.minAge,
    maxAge: data.maxAge,
    maxDistanceKm: data.maxDistanceKm,
    interestedIn: data.interestedIn,
    lookingFor: data.lookingFor,
  });
};
