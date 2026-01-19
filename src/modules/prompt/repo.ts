import { Prompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPromptRepository = AppDataSource.getRepository(Prompt);

export const findPromptByUserId = async (userId: string): Promise<Prompt | null> => {
  return UserPromptRepository.findOne({
    where: {
      user: { id: userId },
    },
  });
};

export const save = async (userPromptData: Partial<Prompt>[]): Promise<Prompt[]> => {
  const userPrompt = UserPromptRepository.create(userPromptData);
  return UserPromptRepository.save(userPrompt);
};
