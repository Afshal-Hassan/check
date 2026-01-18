import { LifestylePreference } from './model';
import { AppDataSource } from '@/config/data-source';

export const LifestylePreferenceRepository = AppDataSource.getRepository(LifestylePreference);

export const findLifestylePreferenceByUserId = async (
  userId: string,
): Promise<LifestylePreference | null> => {
  return LifestylePreferenceRepository.findOne({
    where: {
      user: { id: userId },
    },
  });
};

export const save = async (
  liefestylePreferenceData: Partial<LifestylePreference>,
): Promise<LifestylePreference> => {
  const lifestylePreference = LifestylePreferenceRepository.create(liefestylePreferenceData);
  return LifestylePreferenceRepository.save(lifestylePreference);
};
