import { DeepPartial } from 'typeorm';
import { DatingPreference } from './model';
import { DatingPreferenceDTO } from './dto';
import * as MessageUtil from '@/utils/message.util';
import { findDatingPreferenceByUserId, save } from './repo';
import { DATING_PREFERENCE_ERROR_MESSAGES } from './message';
import { BadRequestException } from '@/exceptions';

export const getDatingPreferenceByUserId = async (
  userId: string,
): Promise<DatingPreference | null> => {
  return findDatingPreferenceByUserId(userId);
};

export const saveDatingPreference = async (
  data: DatingPreferenceDTO,
  languageCode: string,
): Promise<DatingPreference> => {
  const datingPreference = await getDatingPreferenceByUserId(data.userId);

  if (datingPreference)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(DATING_PREFERENCE_ERROR_MESSAGES.ALREADY_SAVED, languageCode),
    );

  return save({
    user: { id: data.userId } as DeepPartial<any>,
    minAge: data.minAge,
    maxAge: data.maxAge,
    interestedIn: data.interestedIn,
    lookingFor: data.lookingFor,
  });
};
