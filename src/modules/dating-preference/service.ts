import { save } from './repo';
import { DeepPartial } from 'typeorm';
import { DatingPreference } from './model';
import { DatingPreferenceDTO } from './dto';

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
