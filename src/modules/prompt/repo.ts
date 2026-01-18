import { Prompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPromptRepository = AppDataSource.getRepository(Prompt);

export const save = async (userPromptData: Partial<Prompt>[]): Promise<Prompt[]> => {
  const userPrompt = UserPromptRepository.create(userPromptData);
  return UserPromptRepository.save(userPrompt);
};
