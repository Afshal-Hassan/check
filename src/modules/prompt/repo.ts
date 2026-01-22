import { Prompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const PromptRepository = AppDataSource.getRepository(Prompt);

export const findAllPrompts = async (languageCode: string): Promise<Prompt[]> => {
  const questionColumnMap = {
    en: 'questionEn',
    fr: 'questionFr',
    es: 'questionEs',
    ar: 'questionAr',
  };

  const questionColumn = questionColumnMap[languageCode as keyof typeof questionColumnMap];

  return PromptRepository.createQueryBuilder('prompt')
    .select(['prompt.id', `prompt.${questionColumn}`])
    .orderBy(`prompt.${questionColumn}`, 'ASC')
    .getMany();
};
