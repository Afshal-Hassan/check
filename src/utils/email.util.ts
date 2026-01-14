import { transporter } from '@/config/email.config';

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  // In production, integrate with SendGrid, SES, or nodemailer
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #666;">
            Use the following OTP code to complete your verification:
          </p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #999;">
            This OTP will expire in 10 minutes. Do not share this code with anyone.
          </p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);
};
