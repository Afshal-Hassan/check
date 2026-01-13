import * as OtpUtil from '@/utils/otp.util';
import * as UserService from '@/modules/user/service';

export const verifyOtp = async (email: string, otp: string) => {
  const valid = OtpUtil.verifyOtp(email, otp);
  if (!valid) throw new Error('Invalid or expired OTP');

  const user = await UserService.getUserByEmail(email);
  if (!user) throw new Error('User not found');

  await UserService.verifyUser(user.id);
  return { userId: user.id, verified: true };
};
