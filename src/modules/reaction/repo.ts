import { Reaction } from './model';
import { EntityManager } from 'typeorm';
import { AppDataSource } from '@/config/data-source';
import { ReactionType } from './enums';

export const ReactionRepository = AppDataSource.getRepository(Reaction);

export const saveOrUpdateReaction = async (data: Partial<Reaction>, manager: EntityManager) => {
  const repo = manager.getRepository(Reaction);

  return repo
    .createQueryBuilder()
    .insert()
    .into(Reaction)
    .values(data)
    .orUpdate({
      conflict_target: ['reaction_giver_id', 'reaction_receiver_id'],
      overwrite: ['reaction_type'],
    })
    .returning('*')
    .execute()
    .then((res) => res.raw[0]);
};

export const findReverseLike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
  manager: EntityManager,
): Promise<Reaction | null> => {
  return manager.getRepository(Reaction).findOne({
    where: {
      reactionGiver: { id: reactionReceiverId },
      reactionReceiver: { id: reactionGiverId },
      reactionType: ReactionType.LIKE,
    },
  });
};

export const findLike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
): Promise<Reaction | null> => {
  return ReactionRepository.findOne({
    where: {
      reactionGiver: { id: reactionGiverId },
      reactionReceiver: { id: reactionReceiverId },
      reactionType: ReactionType.LIKE,
    },
  });
};

export const findDislike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
): Promise<Reaction | null> => {
  return ReactionRepository.findOne({
    where: {
      reactionGiver: { id: reactionGiverId },
      reactionReceiver: { id: reactionReceiverId },
      reactionType: ReactionType.DISLIKE,
    },
  });
};
