import { User } from './model';
import { findUserByEmail, save, updatePasswordByEmail } from './repo';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await findUserByEmail(email);
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return await save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return await updatePasswordByEmail(email, hashedPassword);
};
