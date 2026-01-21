import { UserPrompt } from './model';
import { DeepPartial } from 'typeorm';
import { SavePromptDTO } from './dto';
import { saveUserPromptList } from './repo';
import { BadRequestException } from '@/exceptions';
import * as MessageUtil from '@/utils/message.util';
import { USER_PROMPTS_ERROR_MESSAGES } from './message';
import * as GoogleTranslateUtil from '@/utils/google-translate.util';

export const saveUserPrompts = async (
  data: SavePromptDTO,
  languageCode: string,
): Promise<UserPrompt[]> => {
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
        user: { id: prompt.userId } as DeepPartial<any>,
        prompt: { id: prompt.promptId } as DeepPartial<any>,
        answerEn,
        answerFr,
        answerEs,
        answerAr,
      };
    }),
  );

  return saveUserPromptList(translatedPrompts);
};
