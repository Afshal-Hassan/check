import { Prompt } from './model';
import { findAllPrompts } from './repo';

export const getPrompts = async (languageCode: string): Promise<Prompt[] | null> => {
  return findAllPrompts(languageCode);
};
