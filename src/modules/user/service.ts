import { User } from './model';
import { findUserByEmail, save, update } from './repo';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await findUserByEmail(email);
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return await save(userData);
};

export const verifyUser = async (userId: string): Promise<void> => {
  await update(userId);
};
