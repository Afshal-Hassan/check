import { Like } from './model';
import { AppDataSource } from '@/config/data-source';
import { EntityManager } from 'typeorm';

export const LikeRepository = AppDataSource.getRepository(Like);

export const saveLike = async (likeData: Partial<Like>, manager: EntityManager): Promise<Like> => {
  return manager.getRepository(Like).save(likeData);
};

export const findReverseLike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
  manager: EntityManager,
): Promise<Like | null> => {
  return manager.getRepository(Like).findOne({
    where: {
      reactionGiver: { id: reactionGiverId },
      reactionReceiver: { id: reactionReceiverId },
    },
  });
};
