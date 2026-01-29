export enum OtpAction {
  Signup = 'signup',
  ForgotPassword = 'forgot-password',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export function generateRequestToken() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function feetInToCm(height: number | undefined): number | undefined {
  if (height === undefined) return undefined;

  // Get feet and inches
  const feet = Math.floor(height / 100); // 510 → 5
  const inches = height % 100; // 510 → 10

  // Convert to cm
  return feet * 30.48 + inches * 2.54; // 1 ft = 30.48 cm, 1 in = 2.54 cm
}
