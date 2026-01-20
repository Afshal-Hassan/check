import { DeepPartial } from 'typeorm';
import { OtpAction } from '@/constants';
import * as JwtUtil from '@/utils/jwt.util';
import * as OtpUtil from '@/utils/otp.util';
import * as EmailUtil from '@/utils/email.util';
import * as GoogleClient from '@/clients/google';
import * as MessageUtil from '@/utils/message.util';
import * as PasswordUtil from '@/utils/password.util';
import * as UserService from '@/modules/user/service';
import { AuthType, Role, SocialProvider } from './enums';
import { SignupDto, ForgotPasswordDto, ResetPasswordDto, LoginDto, CompleteSignupDto } from './dto';
import {
  FORGOT_PASSWORD_ERROR_MESSAGES,
  LOGIN_ERROR_MESSAGES,
  RESET_PASSWORD_ERROR_MESSAGES,
  SIGNUP_ERROR_MESSAGES,
} from './message';

export const signup = async (data: SignupDto, languageCode: string) => {
  const { email } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser)
    throw new Error(
      MessageUtil.getLocalizedMessage(SIGNUP_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED, languageCode),
    );

  const otp = OtpUtil.generateOtp();

  await OtpUtil.storeOtpInRedis({
    email,
    action: OtpAction.Signup,
    otp,
  });
  await EmailUtil.sendOtpEmail(email, OtpAction.Signup, otp);

  return { email };
};

export const completeSignUp = async (data: CompleteSignupDto, languageCode: string) => {
  const { fullName, email, password, otp } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser)
    throw new Error(
      MessageUtil.getLocalizedMessage(SIGNUP_ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED, languageCode),
    );

  await OtpUtil.verifyOtp({ email, action: OtpAction.Signup, otp, languageCode });
  await OtpUtil.deleteOtpFromRedis(email, OtpAction.Signup);

  const passwordHash = await PasswordUtil.hashPassword(password);
  const user = await UserService.saveUser({
    email,
    fullName,
    passwordHash,
    role: { id: 2 } as DeepPartial<any>,
    authType: AuthType.Email,
  });

  const token = JwtUtil.generateToken(user, Role.User);

  return { user: { ...user, passwordHash: undefined }, token };
};

export const login = async (data: LoginDto, languageCode: string) => {
  if (data.provider) {
    return loginWithSocial(
      { provider: data.provider, socialToken: data.socialToken },
      languageCode,
    );
  } else {
    return loginWithEmail(
      {
        email: data.email,
        password: data.password,
        role: data.role,
      },
      languageCode,
    );
  }
};

const loginWithEmail = async (
  { email, password, role }: { email: string; password: string; role: string },
  languageCode: string,
) => {
  const userDetails = await UserService.getActiveUserByEmailAndRole(email, role);

  if (!userDetails) {
    throw new Error(
      MessageUtil.getLocalizedMessage(LOGIN_ERROR_MESSAGES.INVALID_EMAIL, languageCode),
    );
  }

  const isPasswordValid = await PasswordUtil.comparePassword(password, userDetails.passwordHash);

  if (!isPasswordValid) {
    throw new Error(
      MessageUtil.getLocalizedMessage(LOGIN_ERROR_MESSAGES.INVALID_CREDENTIALS, languageCode),
    );
  }

  const token = JwtUtil.generateToken({ id: userDetails.id, email: userDetails.email }, role);

  return { user: { ...userDetails, passwordHash: undefined }, token };
};

const loginWithSocial = async (
  { provider, socialToken }: { provider: SocialProvider; socialToken: string },
  languageCode: string,
) => {
  switch (provider) {
    case SocialProvider.Google:
      return continueWithGoogle({ accessToken: socialToken }, languageCode);
    case SocialProvider.Apple:
      throw new Error('Apple login not implemented');
    default:
      throw new Error('Unsupported provider');
  }
};

const continueWithGoogle = async (
  { accessToken }: { accessToken: string },
  languageCode: string,
) => {
  console.log('accessToken:', accessToken);
  const response = await GoogleClient.verifyToken(accessToken);

  if (response.status === 400) {
    throw new Error(
      MessageUtil.getLocalizedMessage(LOGIN_ERROR_MESSAGES.INVALID_CREDENTIALS, languageCode),
    );
  }

  const userDetails = await UserService.getActiveUserByEmailAndRole(response.data.email, Role.User);

  if (userDetails && userDetails.isSuspended) {
    throw new Error(
      MessageUtil.getLocalizedMessage(LOGIN_ERROR_MESSAGES.ACCOUNT_SUSPENDED, languageCode),
    );
  }

  const user =
    userDetails ||
    (await UserService.saveUser({
      email: response.data.email,
      fullName: response.data.name,
      authType: AuthType.Social,
      role: { id: 2 } as DeepPartial<any>,
    }));

  const token = JwtUtil.generateToken({ id: user.id, email: user.email }, Role.User);

  return { user: { ...user, passwordHash: undefined }, token };
};

export const forgotPassword = async (data: ForgotPasswordDto, languageCode: string) => {
  const { email } = data;

  const user = await UserService.getActiveUserByEmail(email);

  if (!user)
    throw new Error(
      MessageUtil.getLocalizedMessage(FORGOT_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND, languageCode),
    );

  const otp = OtpUtil.generateOtp();

  await OtpUtil.storeOtpInRedis({
    email,
    action: OtpAction.ForgotPassword,
    otp,
  });
  await EmailUtil.sendOtpEmail(email, OtpAction.ForgotPassword, otp);

  return { email };
};

export const resetPassword = async (
  data: ResetPasswordDto,
  languageCode: string,
): Promise<void> => {
  const { email, newPassword, otp } = data;

  const user = await UserService.getActiveUserByEmail(email);

  if (!user)
    throw new Error(
      MessageUtil.getLocalizedMessage(RESET_PASSWORD_ERROR_MESSAGES.USER_NOT_FOUND, languageCode),
    );

  const isSameAsOld = await PasswordUtil.comparePassword(newPassword, user.passwordHash);

  if (isSameAsOld)
    throw new Error(
      MessageUtil.getLocalizedMessage(
        RESET_PASSWORD_ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD,
        languageCode,
      ),
    );

  await OtpUtil.verifyOtp({ email, action: OtpAction.ForgotPassword, otp, languageCode });
  await OtpUtil.deleteOtpFromRedis(email, OtpAction.ForgotPassword);

  const passwordHash = await PasswordUtil.hashPassword(newPassword);

  await UserService.updateUserPassword(email, passwordHash);

  return;
};
