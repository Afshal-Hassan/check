export enum OtpAction {
  Signup = 'signup',
  ForgotPassword = 'forgot-password',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export function generateRequestToken() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export const toBase64 = (bytes: any) => {
  if (!bytes) return null;
  return Buffer.from(bytes).toString('base64');
};
