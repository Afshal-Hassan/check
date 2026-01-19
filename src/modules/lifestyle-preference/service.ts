import { DeepPartial } from 'typeorm';
import { LifestylePreference } from './model';
import { LifestylePreferenceDTO } from './dto';
import * as MessageUtil from '@/utils/message.util';
import { findLifestylePreferenceByUserId, save } from './repo';
import { LIFESTYLE_PREFERENCE_ERROR_MESSAGES } from './message';

export const getLifestylePreferenceByUserId = async (
  userId: string,
): Promise<LifestylePreference | null> => {
  return findLifestylePreferenceByUserId(userId);
};

export const saveLifestylePreference = async (
  data: LifestylePreferenceDTO,
  languageCode: string,
): Promise<LifestylePreference> => {
  const lifestylePreference = await findLifestylePreferenceByUserId(data.userId);

  if (lifestylePreference)
    throw new Error(
      MessageUtil.getLocalizedMessage(
        LIFESTYLE_PREFERENCE_ERROR_MESSAGES.ALREADY_SAVED,
        languageCode,
      ),
    );

  return save({
    user: { id: data.userId } as DeepPartial<any>,
    smoking: data.smoking,
    politicalViews: data.politicalViews,
    diet: data.diet,
    workoutRoutine: data.workoutRoutine,
  });
};
