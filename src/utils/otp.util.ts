const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const generateOtp = (email: string): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { code, expiresAt });

  return code;
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
