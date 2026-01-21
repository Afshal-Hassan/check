import { DeepPartial } from 'typeorm';
import { LifestylePreference } from './model';
import { LifestylePreferenceDTO } from './dto';
import { findLifestylePreferenceByUserId, save } from './repo';

export const getLifestylePreferenceByUserId = async (
  userId: string,
): Promise<LifestylePreference | null> => {
  return findLifestylePreferenceByUserId(userId);
};

export const saveLifestylePreference = async (
  data: LifestylePreferenceDTO,
): Promise<LifestylePreference> => {
  return save({
    user: { id: data.userId } as DeepPartial<any>,
    smoking: data.smoking,
    politicalViews: data.politicalViews,
    diet: data.diet,
    workoutRoutine: data.workoutRoutine,
  });
};
