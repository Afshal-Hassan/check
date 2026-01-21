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
  const queryBuilder = DatingPreferenceRepository.createQueryBuilder();

  const columnMapping: Record<string, string> = {
    minAge: 'min_age',
    maxAge: 'max_age',
    interestedIn: 'interested_in',
    lookingFor: 'looking_for',
  };

  const columnsToUpdate = Object.keys(datingPreferenceData)
    .filter((key) => key !== 'user')
    .map((key) => columnMapping[key] || key);

  const result = await queryBuilder
    .insert()
    .into(DatingPreference)
    .values(datingPreferenceData)
    .orUpdate(columnsToUpdate, ['user_id'])
    .returning('*')
    .execute();

  return result.raw[0] as DatingPreference;
};
