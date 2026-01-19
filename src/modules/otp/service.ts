import * as OtpUtil from '@/utils/otp.util';
import * as EmailUtil from '@/utils/email.util';
import { ResendOtpDto, VerifyOtpDto } from './dto';

export const verifyOtp = async (data: VerifyOtpDto, languageCode: string): Promise<void> => {
  return OtpUtil.verifyOtp({ ...data, languageCode });
};

export const resendOtp = async (resendOtpDto: ResendOtpDto) => {
  const { email, action } = resendOtpDto;

  const otp = OtpUtil.generateOtp();

  await OtpUtil.storeOtpInRedis({ email, action, otp });
  await EmailUtil.sendOtpEmail(email, action, otp);

  return { email };
};
