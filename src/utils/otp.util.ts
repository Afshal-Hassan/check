import redisClient from '@/config/redis.config';
import { OTP_EXPIRY_SECONDS } from '@/constants';

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtpInRedis = async (
  email: string,
  action: string,
  otp: string,
): Promise<void> => {
  const otpKey = `otp:${email}:${action}`;
  await redisClient.setEx(otpKey, OTP_EXPIRY_SECONDS, otp);
};

export const verifyOtp = async (email: string, action: string, otp: number): Promise<void> => {
  const otpKey = `otp:${email}:${action}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) throw new Error('OTP has expired or does not exist');
  if (Number(storedOtp) !== otp) throw new Error('Invalid OTP');

  await redisClient.del(otpKey);
};
