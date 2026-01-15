import { LifestylePreference } from './model';
import { AppDataSource } from '@/config/data-source';

export const LifestylePreferenceRepository = AppDataSource.getRepository(LifestylePreference);

export const save = async (
  liefestylePreferenceData: Partial<LifestylePreference>,
): Promise<LifestylePreference> => {
  const user = LifestylePreferenceRepository.create(liefestylePreferenceData);
  return LifestylePreferenceRepository.save(user);
};
