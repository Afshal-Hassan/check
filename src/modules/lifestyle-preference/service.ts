import { findLifestylePreferenceByUserId, save } from './repo';
import { LifestylePreferenceDTO } from './dto';
import { DeepPartial } from 'typeorm';
import { LifestylePreference } from './model';

export const getLifestylePreferenceByUserId = async (
  userId: string,
): Promise<LifestylePreference | null> => {
  return findLifestylePreferenceByUserId(userId);
};

export const saveLifestylePreference = async (
  data: LifestylePreferenceDTO,
): Promise<LifestylePreference> => {
  const lifestylePreference = await findLifestylePreferenceByUserId(data.userId);

  if (lifestylePreference) throw new Error('Lifestyle preference already saved');

  return save({
    user: { id: data.userId } as DeepPartial<any>,
    smoking: data.smoking,
    politicalViews: data.politicalViews,
    diet: data.diet,
    workoutRoutine: data.workoutRoutine,
  });
};
