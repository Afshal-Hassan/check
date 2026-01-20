import { UserPrompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPromptRepository = AppDataSource.getRepository(UserPrompt);

export const findUserPromptsByUserId = async (userId: string): Promise<UserPrompt[]> => {
  return UserPromptRepository.find({
    where: {
      user: { id: userId },
    },
    relations: ['prompt'],
    order: {
      prompt: {
        question: 'ASC',
      },
    },
  });
};

export const saveUserPromptList = async (data: Partial<UserPrompt>[]): Promise<UserPrompt[]> => {
  const userPrompt = UserPromptRepository.create(data);

  return UserPromptRepository.save(userPrompt);
};
