import { User } from './model';
import { UserDTO } from './dto';
import {
  save,
  getUsers,
  findUserByEmail,
  findActiveUserByEmail,
  updateLocationById,
  updatePasswordByEmail,
  findActiveUserByEmailAndRole,
} from './repo';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return findUserByEmail(email);
};

export const getActiveUserByEmail = async (email: string): Promise<User | null> => {
  return findActiveUserByEmail(email);
};

export const getActiveUserByEmailAndRole = async (
  email: string,
  role: string,
): Promise<User | null> => {
  return findActiveUserByEmailAndRole(email, role);
};

export const getUsersList = async (isVerified: boolean, isSuspended: boolean): Promise<User[]> => {
  return getUsers(isVerified, isSuspended);
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  return save(userData);
};

export const updateUserPassword = async (email: string, hashedPassword: string) => {
  return updatePasswordByEmail(email, hashedPassword);
};

// export const updateUserAndProfile = async (data: UserDTO) => {
//   const { userId, country, city, state, interests, ...userProfileData } = data;

//   const user = await updateLocationByUserId(userId, country, city, state);

//   const { bio, dateOfBirth, gender, occupation } = userProfileData;

//   const translations = [
//     {
//       userId,
//       heightCm: 0,
//       languageCode: 'en',
//       bio,
//     },
//   ];

//   const updatedProfile = await UserProfileService.saveUserProfile({
//     userId,
//     dateOfBirth,
//     gender,
//     occupation,
//     translations,
//   });

//   const savedInterests = await InterestService.saveInterests(userId, interests);

//   return {
//     ...user,
//     passwordHash: undefined,
//     bio: updatedProfile.translations?.find((t) => t.languageCode === 'en')?.bio,
//     dateOfBirth: updatedProfile.dateOfBirth,
//     gender: updatedProfile.gender,
//     occupation: updatedProfile.occupation,
//   };
// };

export const updateUserLocation = async (data: UserDTO) => {
  const { userId, country, city, state } = data;

  return updateLocationById(userId, { country, city, state });
};
