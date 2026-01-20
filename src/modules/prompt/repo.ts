import { Prompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const PromptRepository = AppDataSource.getRepository(Prompt);

export const findAllPrompts = async (): Promise<Prompt[]> => {
  return PromptRepository.find({
    order: {
      question: 'ASC',
    },
  });
};
