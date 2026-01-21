import { translate } from '@vitalets/google-translate-api';

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    return text;
  }
};
