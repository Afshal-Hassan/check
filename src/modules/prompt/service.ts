import { findPromptByUserId, save } from './repo';
import { PROMPT_ERROR_MESSAGES } from './message';
import { Prompt } from './model';
import { PromptDTO } from './dto';
import { DeepPartial } from 'typeorm';
import * as MessageUtil from '@/utils/message.util';

export const getPromptByUserId = async (userId: string): Promise<Prompt | null> => {
  return findPromptByUserId(userId);
};

export const savePrompts = async (data: PromptDTO, languageCode: string): Promise<Prompt[]> => {
  const prompt = await getPromptByUserId(data.userId);

  if (prompt)
    throw new Error(
      MessageUtil.getLocalizedMessage(PROMPT_ERROR_MESSAGES.ALREADY_SAVED, languageCode),
    );

  const prompts = data.prompts.map((prompt) => ({
    user: { id: data.userId } as DeepPartial<any>,
    question: prompt.question,
    answer: prompt.answer,
  }));

  return save(prompts);
};
