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
  lifestylePreferenceData: Partial<LifestylePreference>,
): Promise<LifestylePreference> => {
  const queryBuilder = LifestylePreferenceRepository.createQueryBuilder();

  const columnMapping: Record<string, string> = {
    smoking: 'smoking',
    politicalViews: 'political_views',
    diet: 'diet',
    workoutRoutine: 'workout_routine',
  };

  const columnsToUpdate = Object.keys(lifestylePreferenceData)
    .filter((key) => key !== 'user')
    .map((key) => columnMapping[key] || key);

  const result = await queryBuilder
    .insert()
    .into(LifestylePreference)
    .values(lifestylePreferenceData)
    .orUpdate(columnsToUpdate, ['user_id'])
    .returning('*')
    .execute();

  return result.raw[0] as LifestylePreference;
};
