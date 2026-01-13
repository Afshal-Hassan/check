import { OtpDto } from './dto';
import redisClient from '@/config/redis.config';
import * as UserService from '@/modules/user/service';

export const verifyOtp = async (otpDto: OtpDto): Promise<void> => {
  const { email, otp } = otpDto;

  const otpKey = `otp:${email}`;

  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) {
    throw new Error('OTP has expired or does not exist');
  }

  if (Number(storedOtp) !== otp) {
    throw new Error('Invalid OTP');
  }

  await redisClient.del(otpKey);

  await UserService.markUserAsVerified(email);

  return;
};
