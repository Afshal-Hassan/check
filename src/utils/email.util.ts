export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  // In production, integrate with SendGrid, SES, or nodemailer
};
