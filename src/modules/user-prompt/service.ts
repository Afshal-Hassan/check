import { DeepPartial } from 'typeorm';
import { SavePromptDTO } from './dto';
import { UserPrompt } from './model';
import * as MessageUtil from '@/utils/message.util';
import { USER_PROMPTS_ERROR_MESSAGES } from './message';
import { findUserPromptsByUserId, saveUserPromptList } from './repo';

export const saveUserPrompts = async (
  data: SavePromptDTO,
  languageCode: string,
): Promise<UserPrompt[]> => {
  const prompts = await findUserPromptsByUserId(data.prompts[0].userId);

  if (prompts.length > 0) {
    throw new Error(
      MessageUtil.getLocalizedMessage(USER_PROMPTS_ERROR_MESSAGES.ALREADY_SAVED, languageCode),
    );
  }

  return saveUserPromptList(
    data.prompts.map((item) => ({
      user: { id: item.userId } as DeepPartial<any>,
      prompt: { id: item.promptId } as DeepPartial<any>,
      answer: item.answer,
    })),
  );
};
