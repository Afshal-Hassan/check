import { DeepPartial } from 'typeorm';
import { OtpAction } from '@/constants';
import * as JwtUtil from '@/utils/jwt.util';
import * as OtpUtil from '@/utils/otp.util';
import * as EmailUtil from '@/utils/email.util';
import * as GoogleClient from '@/clients/google';
import { AuthType, SocialProvider } from './enums';
import * as PasswordUtil from '@/utils/password.util';
import * as UserService from '@/modules/user/service';
import { SignupDto, ForgotPasswordDto, ResetPasswordDto, LoginDto, CompleteSignupDto } from './dto';

export const signup = async (data: SignupDto) => {
  const { email } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) throw new Error('Email already registered');

  const otp = OtpUtil.generateOtp();

  await OtpUtil.storeOtpInRedis({
    email,
    action: OtpAction.Signup,
    otp,
  });
  await EmailUtil.sendOtpEmail(email, OtpAction.Signup, otp);

  return { email };
};

export const completeSignUp = async (data: CompleteSignupDto) => {
  const { fullName, email, password, otp } = data;

  const existingUser = await UserService.getUserByEmail(email);

  if (existingUser) throw new Error('Email already registered');

  await OtpUtil.verifyOtp({ email, action: OtpAction.Signup, otp });

  const passwordHash = await PasswordUtil.hashPassword(password);
  const user = await UserService.saveUser({
    email,
    fullName,
    passwordHash,
    role: { id: 2 } as DeepPartial<any>,
    authType: AuthType.Email,
  });

  const token = JwtUtil.generateToken(user);

  return { ...user, token, passwordHash: undefined };
};

export const login = async (data: LoginDto) => {
  if (data.provider) {
    return loginWithSocial(data.provider, data.socialToken);
  } else {
    return loginWithEmail(data.email, data.password, data.role);
  }
};

const loginWithEmail = async (email: string, password: string, role: string) => {
  const user = await UserService.getActiveUserByEmailAndRole(email, role);

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
      return continueWithGoogle(socialToken);
    case SocialProvider.Apple:
      throw new Error('Apple login not implemented');
    default:
      throw new Error('Unsupported provider');
  }
};

const continueWithGoogle = async (accessToken: string) => {
  console.log('accessToken:', accessToken);
  const response = await GoogleClient.verifyToken(accessToken);

  if (response.status === 400) {
    throw new Error('Invalid token or credentials');
  }

  const existingUser = await UserService.getUserByEmail(response.data.email);

  if (existingUser && existingUser.isSuspended) {
    throw new Error('Account is suspended');
  }

  const user =
    existingUser ||
    (await UserService.saveUser({
      email: response.data.email,
      fullName: response.data.name,
      authType: AuthType.Social,
      role: { id: 2 } as DeepPartial<any>,
    }));

  const token = JwtUtil.generateToken(user);

  return { ...user, token };
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const { email } = data;

  const user = await UserService.getActiveUserByEmail(email);

  if (!user) throw new Error('User not found');

  const otp = OtpUtil.generateOtp();

  await OtpUtil.storeOtpInRedis({
    email,
    action: OtpAction.ForgotPassword,
    otp,
  });
  await EmailUtil.sendOtpEmail(email, OtpAction.ForgotPassword, otp);

  return { email };
};

export const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
  const { email, newPassword, otp } = data;

  const user = await UserService.getActiveUserByEmail(email);

  if (!user) throw new Error('User not found');

  const isSameAsOld = await PasswordUtil.comparePassword(newPassword, user.passwordHash);

  if (isSameAsOld) throw new Error('New password cannot be the same as the old password');

  await OtpUtil.verifyOtp({ email, action: OtpAction.ForgotPassword, otp });

  const passwordHash = await PasswordUtil.hashPassword(newPassword);

  await UserService.updateUserPassword(email, passwordHash);

  return;
};
