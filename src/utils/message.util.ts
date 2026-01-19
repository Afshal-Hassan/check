export const getLocalizedMessage = <T extends Record<string, string>>(
  messages: T,
  languageCode: string,
): string => {
  return messages[languageCode as keyof T];
};
