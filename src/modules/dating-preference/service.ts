import { DatingPreferenceDTO } from './dto';
import { DatingPreference } from './model';
import { save } from './repo';

export const saveDatingPreference = async (
  data: DatingPreferenceDTO,
): Promise<DatingPreference> => {
  return save(data);
};
