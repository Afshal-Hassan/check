import { DeepPartial } from 'typeorm';
import { LifestylePreference } from './model';
import { LifestylePreferenceDTO } from './dto';
import { findLifestylePreferenceByUserId, save } from './repo';

export const getLifestylePreferenceByUserId = async (
  userId: string,
): Promise<LifestylePreference | null> => {
  return findLifestylePreferenceByUserId(userId);
};

export const saveLifestylePreference = async (userId: string, data: LifestylePreferenceDTO) => {
  const lifestylePreference: any = await save({
    user: { id: userId } as DeepPartial<any>,
    smoking: data.smoking,
    politicalViews: data.politicalViews,
    diet: data.diet,
    workoutRoutine: data.workoutRoutine,
  });

  return {
    id: lifestylePreference.id,
    smoking: lifestylePreference.smoking,
    politicalViews: lifestylePreference.political_views,
    diet: lifestylePreference.diet,
    workoutRoutine: lifestylePreference.workout_routine,
  };
};
