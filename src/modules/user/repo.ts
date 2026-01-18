import { User } from './model';
import { EntityManager, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/config/data-source';

export const UserRepository = AppDataSource.getRepository(User);

export const findUserAndProfilePictureById = async (userId: string) => {
  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .leftJoin('user_photos', 'photo', 'photo.user_id = user.id AND photo.is_primary = :isPrimary', {
      isPrimary: true,
    })
    .addSelect(['photo.id'])
    .where('user.id = :userId', { userId })
    .getRawOne();

  if (!result) return null;

  return {
    id: result.user_id,
    hasProfilePicture: !!result.photo_id,
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({ where: { email } });
};

export const findActiveUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({
    where: {
      email,
      isSuspended: false,
    },
  });
};

export const findActiveUserByEmailAndRole = async (
  email: string,
  role: string,
): Promise<User | null> => {
  return UserRepository.findOne({
    where: {
      email,
      isSuspended: false,
      role: { name: role.toUpperCase() },
    },
    relations: ['role'],
  });
};

export const save = async (userData: Partial<User>): Promise<User> => {
  const user = UserRepository.create(userData);
  return UserRepository.save(user);
};

export const getUsers = async (isVerified: boolean, isSuspended: boolean): Promise<User[]> => {
  const queryBuilder = AppDataSource.getRepository(User).createQueryBuilder('user');

  if (isVerified !== undefined) {
    queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
  }

  if (isSuspended !== undefined) {
    queryBuilder.andWhere('user.isSuspended = :isSuspended', { isSuspended });
  }

  return queryBuilder.getMany();
};

export const updatePasswordByEmail = async (
  email: string,
  hashedPassword: string,
): Promise<UpdateResult> => {
  return UserRepository.update({ email }, { passwordHash: hashedPassword });
};

export const updateLocationById = async (
  userId: string,
  userData: Partial<User>,
  manager: EntityManager,
): Promise<User> => {
  const repo = manager ? manager.getRepository(User) : UserRepository;

  const user = await repo.preload({
    id: userId,
    ...userData,
  });

  if (!user) throw new Error('User not found');

  return repo.save(user);
};
