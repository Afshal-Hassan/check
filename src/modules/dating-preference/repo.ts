import { DatingPreference } from './model';
import { AppDataSource } from '@/config/data-source';

export const DatingPreferenceRepository = AppDataSource.getRepository(DatingPreference);

export const findDatingPreferenceByUserId = async (
  userId: string,
): Promise<DatingPreference | null> => {
  return DatingPreferenceRepository.findOne({
    where: {
      user: { id: userId },
    },
  });
};

export const save = async (
  datingPreferenceData: Partial<DatingPreference>,
): Promise<DatingPreference> => {
  const datingPreference = DatingPreferenceRepository.create(datingPreferenceData);
  return DatingPreferenceRepository.save(datingPreference);
};
