import { EntityManager } from 'typeorm';
import { UserProfile } from './model';
import { AppDataSource } from '@/config/data-source';

export const UserProfileRepository = AppDataSource.getRepository(UserProfile);

export const save = async (
  userProfileData: Partial<UserProfile>,
  manager?: EntityManager,
): Promise<UserProfile> => {
  const queryBuilder = manager
    ? manager.createQueryBuilder()
    : UserProfileRepository.createQueryBuilder();

  const columnMapping: Record<string, string> = {
    bioEn: 'bio_en',
    bioFr: 'bio_fr',
    bioEs: 'bio_es',
    bioAr: 'bio_ar',
    dateOfBirth: 'date_of_birth',
    occupation: 'occupation',
    gender: 'gender',
  };

  const columnsToUpdate = Object.keys(userProfileData)
    .filter((key) => key !== 'user')
    .map((key) => columnMapping[key] || key);

  const result = await queryBuilder
    .insert()
    .into(UserProfile)
    .values(userProfileData)
    .orUpdate(columnsToUpdate, ['user_id'])
    .returning('*')
    .execute();

  return result.raw[0] as UserProfile;
};

export const updatePersonalDetailsByUserId = async (
  userId: string,
  data: Partial<UserProfile>,
  manager?: EntityManager,
): Promise<UserProfile> => {
  const updateData: Partial<UserProfile> = {};

  if (data.heightEn !== undefined) updateData.heightEn = data.heightEn;
  if (data.heightFr !== undefined) updateData.heightFr = data.heightFr;
  if (data.heightEs !== undefined) updateData.heightEs = data.heightEs;
  if (data.heightAr !== undefined) updateData.heightAr = data.heightAr;

  if (data.bodyType !== undefined) updateData.bodyType = data.bodyType;
  if (data.relationshipStatus !== undefined)
    updateData.relationshipStatus = data.relationshipStatus;
  if (data.childrenPreference !== undefined)
    updateData.childrenPreference = data.childrenPreference;

  const queryBuilder = manager
    ? manager.createQueryBuilder()
    : UserProfileRepository.createQueryBuilder();

  const result = await queryBuilder
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
