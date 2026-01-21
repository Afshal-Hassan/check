import { UserPrompt } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserPromptRepository = AppDataSource.getRepository(UserPrompt);

export const findUserPromptsByUserId = async (userId: string, languageCode: string) => {
  const questionColumnMap = {
    en: 'questionEn',
    fr: 'questionFr',
    es: 'questionEs',
    ar: 'questionAr',
  };

  const answerColumnMap = {
    en: 'answerEn',
    fr: 'answerFr',
    es: 'answerEs',
    ar: 'answerAr',
  };

  const questionColumn = questionColumnMap[languageCode as keyof typeof questionColumnMap];
  const answerColumn = answerColumnMap[languageCode as keyof typeof answerColumnMap];

  return UserPromptRepository.createQueryBuilder('up')
    .innerJoin('up.prompt', 'prompt')
    .where('up.user_id = :userId', { userId })
    .select(['up.id AS id', `prompt.${questionColumn} AS question`, `up.${answerColumn} AS answer`])
    .orderBy(`prompt.${questionColumn}`, 'ASC')
    .getRawMany();
};

export const saveUserPromptList = async (data: Partial<UserPrompt>[]): Promise<UserPrompt[]> => {
  if (data.length === 0) return [];

  const queryBuilder = UserPromptRepository.createQueryBuilder();

  const columnsToUpdate = ['answer_en', 'answer_fr', 'answer_es', 'answer_ar'];

  const result = await queryBuilder
    .insert()
    .into(UserPrompt)
    .values(data)
    .orUpdate(columnsToUpdate, ['user_id', 'prompt_id'])
    .returning('*')
    .execute();

  return result.raw as UserPrompt[];
};
