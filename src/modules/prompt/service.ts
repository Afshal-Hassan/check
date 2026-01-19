import { findPromptByUserId, save } from './repo';
import { Prompt } from './model';
import { PromptDTO } from './dto';
import { DeepPartial } from 'typeorm';

export const getPromptByUserId = async (userId: string): Promise<Prompt | null> => {
  return findPromptByUserId(userId);
};

export const savePrompts = async (data: PromptDTO): Promise<Prompt[]> => {
  const prompt = await getPromptByUserId(data.userId);

  if (prompt) throw new Error('Prompts are already saved');

  const prompts = data.prompts.map((prompt) => ({
    user: { id: data.userId } as DeepPartial<any>,
    question: prompt.question,
    answer: prompt.answer,
  }));

  return save(prompts);
};
