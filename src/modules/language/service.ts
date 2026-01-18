import { save } from './repo';
import { EntityManager } from 'typeorm';

export const saveLanguages = async (
  data: {
    userId: string;
    languages: string[];
  },
  manager: EntityManager,
): Promise<void> => {
  return save(data, manager);
};
