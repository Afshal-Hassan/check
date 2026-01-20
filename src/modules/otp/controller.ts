import * as OtpService from './service';
import { Request, Response } from 'express';
import * as HeadersUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { OTP_SUCCESS_MESSAGES } from './message';

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const languageCode = HeadersUtil.getLanguageCode(req);
    await OtpService.verifyOtp(req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(OTP_SUCCESS_MESSAGES.VERIFIED, languageCode),
    });
  } catch (err: any) {
    throw err;
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const languageCode = HeadersUtil.getLanguageCode(req);
    const result = await OtpService.resendOtp(req.body);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(OTP_SUCCESS_MESSAGES.RESENT, languageCode),
      ...result,
    });
  } catch (err: any) {
    throw err;
  }
};
