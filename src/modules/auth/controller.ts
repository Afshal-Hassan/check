import * as AuthService from './service';
import { Request, Response } from 'express';
import * as HeaderUtil from '@/utils/header.util';
import * as MessageUtil from '@/utils/message.util';
import { AUTH_SUCCESS_MESSAGES } from './message';

export const signup = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await AuthService.signup(req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(AUTH_SUCCESS_MESSAGES.OTP_SENT, languageCode),
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const completeSignup = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await AuthService.completeSignUp(req.body, languageCode);

    res.status(201).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_SUCCESS_MESSAGES.SIGNUP_COMPLETED,
        languageCode,
      ),
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await AuthService.login(req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(AUTH_SUCCESS_MESSAGES.LOGIN_COMPLETED, languageCode),
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    const result = await AuthService.forgotPassword(req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_OTP_SENT,
        languageCode,
      ),
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const languageCode = HeaderUtil.getLanguageCode(req);
    await AuthService.resetPassword(req.body, languageCode);

    res.status(200).json({
      message: MessageUtil.getLocalizedMessage(
        AUTH_SUCCESS_MESSAGES.PASSWORD_UPDATED,
        languageCode,
      ),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
