import { Match } from './model';
import { EntityManager } from 'typeorm';
import { AppDataSource } from '@/config/data-source';

export const MatchRepository = AppDataSource.getRepository(Match);

export const saveMatch = async (
  matchData: Partial<Match>,
  manager: EntityManager,
): Promise<Match> => {
  return manager.getRepository(Match).save(matchData);
};

export const deleteMatchByUserId = async (
  data: { user1Id: string; user2Id: string },
  manager: EntityManager,
) => {
  const { user1Id, user2Id } = data;

  const result = await manager
    .createQueryBuilder()
    .delete()
    .from(Match)
    .where(
      '(user1_id = :user1 AND user2_id = :user2) OR (user1_id = :user2 AND user2_id = :user1)',
      { user1: user1Id, user2: user2Id },
    )
    .returning('*')
    .execute();

  return result.raw[0] || null;
};
