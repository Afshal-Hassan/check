import { saveLike, findReverseLike } from './repo';
import { AppDataSource } from '@/config/data-source';
import { DeepPartial, EntityManager } from 'typeorm';
import * as MatchService from '@/modules/match/service';
import { ReactionType } from './enums';

export const saveUserLike = async (reactionGiverId: string, reactionReceiverId: string) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let match = null;

  try {
    const like = await saveLike(
      {
        reactionGiver: { id: reactionGiverId } as DeepPartial<any>,
        reactionReceiver: { id: reactionReceiverId } as DeepPartial<any>,
        reactionType: ReactionType.LIKE,
      },
      queryRunner.manager,
    );

    const isMutual = await hasMutualLike(reactionGiverId, reactionReceiverId, queryRunner.manager);

    if (isMutual) {
      match = await MatchService.createMatch(
        {
          user1Id: reactionGiverId,
          user2Id: reactionReceiverId,
        },
        queryRunner.manager,
      );
    }

    await queryRunner.commitTransaction();

    return {
      id: like.id,
      reactionGiverId: like.reactionGiver.id,
      reactionReceiverId: like.reactionReceiver.id,
      createdAt: like.createdAt,
      match: {
        id: match?.id,
        user1Id: match?.user1.id,
        user2Id: match?.user2.id,
        matchedAt: match?.matchedAt,
      },
    };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

const hasMutualLike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
  manager: EntityManager,
): Promise<boolean> => {
  const reverseLike = await findReverseLike(reactionGiverId, reactionReceiverId, manager);
  return !!reverseLike;
};
