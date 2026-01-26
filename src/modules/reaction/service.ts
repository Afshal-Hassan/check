import { ReactionType } from './enums';
import { BadRequestException } from '@/exceptions';
import * as MessageUtil from '@/utils/message.util';
import { REACTION_ERROR_MESSAGES } from './message';
import { AppDataSource } from '@/config/data-source';
import { DeepPartial, EntityManager } from 'typeorm';
import * as MatchService from '@/modules/match/service';
import { findDislike, findLike, findReverseLike, saveOrUpdateReaction } from './repo';

export const saveLike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
  languageCode: string,
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let match = null;

  try {
    const isLikeExist = await findLike(reactionGiverId, reactionReceiverId);

    if (isLikeExist)
      throw new BadRequestException(
        MessageUtil.getLocalizedMessage(REACTION_ERROR_MESSAGES.LIKE.ALREADY_LIKED, languageCode),
      );

    const like = await saveOrUpdateReaction(
      {
        reactionGiver: { id: reactionGiverId } as DeepPartial<any>,
        reactionReceiver: { id: reactionReceiverId } as DeepPartial<any>,
        reactionType: ReactionType.LIKE,
      },
      queryRunner.manager,
    );

    const isMutual = await hasMutualLike(reactionReceiverId, reactionGiverId, queryRunner.manager);

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
      reactionType: like.reaction_type,
      reactionGiverId: like.reaction_giver_id,
      reactionReceiverId: like.reaction_receiver_id_id,
      createdAt: like.created_at,
      match: match
        ? {
            id: match.id,
            user1Id: match.user1_id,
            user2Id: match.user2_id,
            matchedAt: match.matched_at,
          }
        : null,
    };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const saveDislike = async (
  reactionGiverId: string,
  reactionReceiverId: string,
  languageCode: string,
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const isDislikeExist = await findDislike(reactionGiverId, reactionReceiverId);

    if (isDislikeExist)
      throw new BadRequestException(
        MessageUtil.getLocalizedMessage(
          REACTION_ERROR_MESSAGES.DISLIKE.ALREADY_DISLIKED,
          languageCode,
        ),
      );

    const dislike = await saveOrUpdateReaction(
      {
        reactionGiver: { id: reactionGiverId } as DeepPartial<any>,
        reactionReceiver: { id: reactionReceiverId } as DeepPartial<any>,
        reactionType: ReactionType.DISLIKE,
      },
      queryRunner.manager,
    );

    const match = await MatchService.deleteMatch(
      {
        user1Id: reactionGiverId,
        user2Id: reactionReceiverId,
      },
      queryRunner.manager,
    );

    await queryRunner.commitTransaction();

    return {
      id: dislike.id,
      reactionGiverId: dislike.reaction_giver_id,
      reactionReceiverId: dislike.reaction_giver_id_id,
      createdAt: dislike.created_at,
      match: match
        ? {
            id: match.id,
            user1Id: match.user1_id,
            user2Id: match.user2_id,
            matchedAt: match.matched_at,
          }
        : null,
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
