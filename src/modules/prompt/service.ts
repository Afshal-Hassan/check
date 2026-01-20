import { Prompt } from './model';
import { findAllPrompts } from './repo';

export const getPrompts = async (): Promise<Prompt[] | null> => {
  return findAllPrompts();
};
