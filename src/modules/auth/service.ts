import bcrypt from 'bcrypt';
import { SignupDto } from './dtos/Signup';
import { generateOtp } from '@/utils/otp.util';
import { sendOtpEmail } from '@/utils/email.util';
import * as UserService from '@/modules/user/service';

export const signup = async (data: SignupDto) => {
  const existingUser = await UserService.getUserByEmail(data.email);

  if (existingUser) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await UserService.saveUser({ ...data, passwordHash });

  const otp = generateOtp(user.email);
  await sendOtpEmail(user.email, otp);

  return { userId: user.id, email: user.email };
};
