import { User } from './model';
import { UpdateResult } from 'typeorm';
import { AppDataSource } from '@/config/data-source';

export const UserRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({ where: { email } });
};

export const save = async (userData: Partial<User>): Promise<User> => {
  const user = UserRepository.create(userData);
  return UserRepository.save(user);
};

export const updatePasswordByEmail = async (
  email: string,
  hashedPassword: string,
): Promise<UpdateResult> => {
  return UserRepository.update({ email }, { passwordHash: hashedPassword });
};

export const findActiveUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({
    where: {
      email,
      isSuspended: false,
    },
  });
};

export const updateLocationById = async (userId: string, userData: Partial<User>) => {
  const user = await UserRepository.preload({
    id: userId,
    ...userData,
  });

  if (!user) throw new Error('User not found');

  return await UserRepository.save(user);
};
