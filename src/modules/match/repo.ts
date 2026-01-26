import { Match } from './model';
import { AppDataSource } from '@/config/data-source';
import { EntityManager } from 'typeorm';

export const MatchRepository = AppDataSource.getRepository(Match);

export const saveMatch = async (
  matchData: Partial<Match>,
  manager: EntityManager,
): Promise<Match> => {
  return manager.getRepository(Match).save(matchData);
};
