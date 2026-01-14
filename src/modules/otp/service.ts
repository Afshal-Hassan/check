import * as OtpUtil from '@/utils/otp.util';
import * as EmailUtil from '@/utils/email.util';
import redisClient from '@/config/redis.config';
import { OTP_EXPIRY_SECONDS } from '@/constants';
import { ResendOtpDto, SignupVerificationDto } from './dto';

export const verifyOtp = async (data: SignupVerificationDto): Promise<void> => {
  const { email, otp } = data;

  const otpKey = `otp:${email}`;

  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) {
    throw new Error('OTP has expired or does not exist');
  }

  if (Number(storedOtp) !== otp) {
    throw new Error('Invalid OTP');
  }

  await redisClient.del(otpKey);

  return;
};

export const resendOtp = async (resendOtpDto: ResendOtpDto) => {
  const otp = OtpUtil.generateOtp();

  const { email } = resendOtpDto;

  const otpKey = `otp:${email}`;
  await redisClient.setEx(otpKey, OTP_EXPIRY_SECONDS, otp);

  await EmailUtil.sendOtpEmail(email, otp);

  return { email };
};
