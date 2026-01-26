import { Match } from './model';
import { DeepPartial, EntityManager } from 'typeorm';
import { deleteMatchByUserId, saveMatch } from './repo';

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

export const deleteMatch = async (
  data: { user1Id: string; user2Id: string },
  manager: EntityManager,
) => {
  return deleteMatchByUserId(
    {
      user1Id: data.user1Id,
      user2Id: data.user2Id,
    },
    manager,
  );
};
