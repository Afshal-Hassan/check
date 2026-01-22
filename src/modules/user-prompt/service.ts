import { UserPrompt } from './model';
import { DeepPartial } from 'typeorm';
import { SavePromptDTO } from './dto';
import { saveUserPromptList } from './repo';
import { BadRequestException } from '@/exceptions';
import * as MessageUtil from '@/utils/message.util';
import { USER_PROMPTS_ERROR_MESSAGES } from './message';
import * as GoogleTranslateUtil from '@/utils/google-translate.util';

export const saveUserPrompts = async (
  userId: string,
  data: SavePromptDTO,
  languageCode: string,
) => {
  const promptIds = data.prompts.map((p) => p.promptId);

  const uniquePromptIds = new Set(promptIds);

  if (promptIds.length !== uniquePromptIds.size) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(
        USER_PROMPTS_ERROR_MESSAGES.DUPLICATE_PROMPT_IDS,
        languageCode,
      ),
    );
  }

  const translatedPrompts = await Promise.all(
    data.prompts.map(async (prompt) => {
      const [answerEn, answerFr, answerEs, answerAr] = await Promise.all([
        GoogleTranslateUtil.translateText(prompt.answer, 'en'),
        GoogleTranslateUtil.translateText(prompt.answer, 'fr'),
        GoogleTranslateUtil.translateText(prompt.answer, 'es'),
        GoogleTranslateUtil.translateText(prompt.answer, 'ar'),
      ]);

      return {
        user: { id: userId } as DeepPartial<any>,
        prompt: { id: prompt.promptId } as DeepPartial<any>,
        answerEn,
        answerFr,
        answerEs,
        answerAr,
      };
    }),
  );

  const savedPrompts: any = await saveUserPromptList(translatedPrompts);

  return savedPrompts.map((prompt: any) => ({
    id: prompt.id,
    answerEn: prompt.answer_en,
    answerFr: prompt.answer_fr,
    answerEs: prompt.answer_es,
    answerAr: prompt.answer_ar,
    promptId: prompt.prompt_id,
    userId: prompt.user_id,
  }));
};
