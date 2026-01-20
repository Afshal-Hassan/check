import { OtpAction } from '@/constants';
import redisClient from '@/config/redis.config';
import * as MessageUtil from '@/utils/message.util';
import { BadRequestException } from '@/exceptions';

interface StoreOtpParams {
  email: string;
  action: string;
  otp: string;
}

export const OTP_ERROR_MESSAGES = {
  EXPIRED_OR_NOT_EXIST: {
    en: 'OTP has expired or does not exist',
    fr: "Le OTP a expiré ou n'existe pas",
    es: 'El OTP ha expirado o no existe',
    ar: 'انتهت صلاحية رمز OTP أو غير موجود',
  },
  INVALID: {
    en: 'Invalid OTP',
    fr: 'OTP invalide',
    es: 'OTP inválido',
    ar: 'رمز OTP غير صالح',
  },
};

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
  languageCode,
}: {
  email: string;
  action: string;
  otp: number;
  languageCode: string;
}): Promise<void> => {
  const otpKey = `otp:${email}:${action}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(OTP_ERROR_MESSAGES.EXPIRED_OR_NOT_EXIST, languageCode),
    );

  if (Number(storedOtp) !== otp)
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(OTP_ERROR_MESSAGES.INVALID, languageCode),
    );
};

export const deleteOtpFromRedis = async (email: string, action: string): Promise<void> => {
  const otpKey = `otp:${email}:${action}`;
  await redisClient.del(otpKey);
};
