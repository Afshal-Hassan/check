import { save } from './repo';
import { LifestylePreferenceDTO } from './dto';

export const saveLifestylePreference = async (data: LifestylePreferenceDTO) => {
  return save(data);
};
