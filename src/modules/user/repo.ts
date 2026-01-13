import { User } from './model';
import { UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';

export const UserRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await UserRepository.findOne({ where: { email } });
};

export const save = async (userData: Partial<User>): Promise<User> => {
  const user = UserRepository.create(userData);
  return await UserRepository.save(user);
};

export const updateUserVerificationById = async (userId: string): Promise<UpdateResult> => {
  return await UserRepository.update(userId, { isVerified: true });
};
