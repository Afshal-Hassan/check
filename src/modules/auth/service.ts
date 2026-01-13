import bcrypt from 'bcrypt';
import { SignupDto } from './dto';
import * as OtpUtil from '@/utils/otp.util';
import redisClient from '@/config/redis.config';
import * as EmailUtil from '@/utils/email.util';
import * as UserService from '@/modules/user/service';

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export const signup = async (data: SignupDto) => {
  const existingUser = await UserService.getUserByEmail(data.email);

  if (existingUser) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await UserService.saveUser({ ...data, passwordHash });

  const otp = OtpUtil.generateOtp(user.email);

  const otpKey = `otp:${user.email}`;
  await redisClient.setEx(otpKey, OTP_EXPIRY_SECONDS, otp);

  await EmailUtil.sendOtpEmail(user.email, otp);

  return { userId: user.id, email: user.email };
};
