import { EntityManager } from 'typeorm';
import { UserProfile } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserProfileRepository = AppDataSource.getRepository(UserProfile);

export const save = async (
  userProfileData: Partial<UserProfile>,
  manager: EntityManager,
): Promise<UserProfile> => {
  const repo = manager ? manager.getRepository(UserProfile) : UserProfileRepository;
  const userProfile = repo.create(userProfileData);

  return repo.save(userProfile);
};

export const updatePersonalDetailsByUserId = async (
  userId: string,
  data: Partial<UserProfile>,
): Promise<UserProfile> => {
  const updateData: Partial<UserProfile> = {};

  if (data.heightEn !== undefined) updateData.heightEn = data.heightEn;
  if (data.heightFr !== undefined) updateData.heightFr = data.heightFr;
  if (data.heightSp !== undefined) updateData.heightSp = data.heightSp;
  if (data.heightAr !== undefined) updateData.heightAr = data.heightAr;

  if (data.bodyType !== undefined) updateData.bodyType = data.bodyType;
  if (data.relationshipStatus !== undefined)
    updateData.relationshipStatus = data.relationshipStatus;
  if (data.childrenPreference !== undefined)
    updateData.childrenPreference = data.childrenPreference;

  const result = await UserProfileRepository.createQueryBuilder()
    .update(UserProfile)
    .set(updateData)
    .where('user_id = :userId', { userId })
    .returning('*')
    .execute();

  if (!result.raw.length) {
    throw new Error('User profile not found');
  }

  return result.raw[0] as UserProfile;
};
