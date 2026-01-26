import { DeepPartial, EntityManager } from 'typeorm';
import { Match } from './model';
import { saveMatch } from './repo';

export const createMatch = async (
  data: { user1Id: string; user2Id: string },
  manager: EntityManager,
): Promise<Match> => {
  return saveMatch(
    {
      user1: { id: data.user1Id } as DeepPartial<any>,
      user2: { id: data.user2Id } as DeepPartial<any>,
    },
    manager,
  );
};
