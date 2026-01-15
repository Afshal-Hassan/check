import redisClient from '@/config/redis.config';
import { OtpAction } from '@/constants';

interface StoreOtpParams {
  email: string;
  action: string;
  otp: string;
}

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtpInRedis = async ({ email, action, otp }: StoreOtpParams): Promise<any> => {
  const otpKey = `otp:${email}:${action}`;
  const expiry =
    action === OtpAction.Signup
      ? Number(process.env.SIGNUP_OTP_EXPIRY_SECONDS)
      : Number(process.env.FORGOT_PASSWORD_OTP_EXPIRY_SECONDS);

  return redisClient.setEx(otpKey, expiry, otp);
};

export const verifyOtp = async ({
  email,
  action,
  otp,
}: {
  email: string;
  action: string;
  otp: number;
}): Promise<void> => {
  const otpKey = `otp:${email}:${action}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) throw new Error('OTP has expired or does not exist');
  if (Number(storedOtp) !== otp) throw new Error('Invalid OTP');

  await redisClient.del(otpKey);
};
