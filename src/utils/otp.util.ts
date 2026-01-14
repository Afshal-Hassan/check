const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOtp = (email: string, code: string): boolean => {
  const otp = otpStore.get(email);

  if (!otp) return false;

  if (otp.expiresAt < Date.now()) {
    otpStore.delete(email);
    return false;
  }

  const isValid = otp.code === code;

  if (isValid) otpStore.delete(email);

  return isValid;
};
