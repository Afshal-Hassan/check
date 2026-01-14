import bcrypt from 'bcrypt';
import * as OtpUtil from '@/utils/otp.util';
import redisClient from '@/config/redis.config';
import * as EmailUtil from '@/utils/email.util';
import { OTP_EXPIRY_SECONDS } from '@/constants';
import * as UserService from '@/modules/user/service';
import { ForgotPasswordDto, ResetPasswordDto, SignupDto, UserDto } from './dto';

export const signup = async (data: SignupDto) => {
  const { email } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) throw new Error('Email already registered');

  const otp = OtpUtil.generateOtp();

  const otpKey = `otp:${email}`;
  await redisClient.setEx(otpKey, OTP_EXPIRY_SECONDS, otp);

  await EmailUtil.sendOtpEmail(email, otp);

  return { email };
};

export const save = async (data: UserDto) => {
  const existingUser = await UserService.getUserByEmail(data.email);

  if (existingUser) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await UserService.saveUser({ ...data, passwordHash });

  return { userId: user.id };
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const { email } = data;

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new Error('User not found');

  const otp = OtpUtil.generateOtp();

  const otpKey = `otp:${email}`;
  await redisClient.setEx(otpKey, OTP_EXPIRY_SECONDS, otp);

  await EmailUtil.sendOtpEmail(email, otp);

  return { email };
};

export const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
  const { email, newPassword } = data;

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new Error('User not found');

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await UserService.updateUserPassword(email, passwordHash);

  return;
};
