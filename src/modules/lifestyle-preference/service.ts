import { save } from './repo';
import { LifestylePreferenceDTO } from './dto';
import { DeepPartial } from 'typeorm';
import { LifestylePreference } from './model';

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
