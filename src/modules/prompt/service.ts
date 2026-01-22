import { findAllPrompts } from './repo';

export const getPrompts = async (languageCode: string) => {
  const prompts = await findAllPrompts(languageCode);

  return (
    prompts?.map((prompt) => {
      const questions = {
        en: prompt.questionEn,
        es: prompt.questionEs,
        ar: prompt.questionAr,
        fr: prompt.questionFr,
      };

      return {
        id: prompt.id,
        question: questions[languageCode as keyof typeof questions],
      };
    }) ?? null
  );
};
