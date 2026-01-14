import { SocialProvider } from './enums';
import * as JwtUtil from '@/utils/jwt.util';
import * as OtpUtil from '@/utils/otp.util';
import * as EmailUtil from '@/utils/email.util';
import * as GoogleClient from '@/clients/google';
import * as PasswordUtil from '@/utils/password.util';
import * as UserService from '@/modules/user/service';
import {
  OtpVerificationDto,
  SignupDto,
  UserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  LoginDto,
} from './dto';

export const signup = async (data: SignupDto) => {
  const { email } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) throw new Error('Email already registered');

  const otp = OtpUtil.generateOtp();
  await OtpUtil.storeOtpInRedis(email, 'signup', otp);

  await EmailUtil.sendOtpEmail(email, otp);

  return { email };
};

export const completeSignUp = async (data: OtpVerificationDto & UserDto) => {
  const { email, password, otp } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) throw new Error('Email already registered');

  await OtpUtil.verifyOtp(email, 'signup', otp);

  const passwordHash = await PasswordUtil.hashPassword(password);
  const user = await UserService.saveUser({
    ...data,
    passwordHash,
  });

  const token = JwtUtil.generateToken(user);

  return { ...user, token };
};

export const login = async (data: LoginDto) => {
  if (data.provider) {
    return await loginWithSocial(data.provider, data.socialToken);
  } else {
    return await loginWithEmail(data.email, data.password);
  }
};

const loginWithEmail = async (email: string, password: string) => {
  const user = await UserService.getUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email');
  }

  const isPasswordValid = await PasswordUtil.comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = JwtUtil.generateToken(user);

  return { ...user, token };
};

const loginWithSocial = async (provider: SocialProvider, socialToken: string) => {
  switch (provider) {
    case SocialProvider.Google:
      return await continueWithGoogle(socialToken);
    case SocialProvider.Apple:
      throw new Error('Apple login not implemented');
    default:
      throw new Error('Unsupported provider');
  }
};

const continueWithGoogle = async (accessToken: string) => {
  const response = await GoogleClient.verifyToken(accessToken);

  if (response.status === 400) {
    throw new Error('Invalid token or credentials');
  }

  const user =
    (await UserService.getUserByEmail(response.data.email)) ||
    (await UserService.saveUser({
      email: response.data.email,
      fullName: response.data.name,
    }));

  const token = JwtUtil.generateToken(user);

  return { ...user, token };
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const { email } = data;

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new Error('User not found');

  const otp = OtpUtil.generateOtp();
  await OtpUtil.storeOtpInRedis(email, 'forgot-password', otp);

  await EmailUtil.sendOtpEmail(email, otp);

  return { email };
};

export const resetPassword = async (data: OtpVerificationDto & ResetPasswordDto): Promise<void> => {
  const { email, newPassword, otp } = data;

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new Error('User not found');

  await OtpUtil.verifyOtp(email, 'forgot-password', otp);

  const passwordHash = await PasswordUtil.hashPassword(newPassword);

  await UserService.updateUserPassword(email, passwordHash);

  return;
};
