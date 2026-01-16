import { UserPrompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPromptRepository = AppDataSource.getRepository(UserPrompt);

export const save = async (userPromptData: Partial<UserPrompt>): Promise<UserPrompt> => {
  const userPrompt = UserPromptRepository.create(userPromptData);
  return UserPromptRepository.save(userPrompt);
};
