import { OtpAction } from '@/constants';
import { transporter } from '@/config/email.config';
import { ENV } from '@/config/env.config';

const APP_NAME = 'Look A Like';

export const sendOtpEmail = async (email: string, action: OtpAction, otp: string) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);

  const signupExpirySeconds = ENV.OTP.SIGNUP_EXPIRY_SECONDS;
  const forgotExpirySeconds = ENV.OTP.FORGOT_PASSWORD_EXPIRY_SECONDS;

  const expirySeconds =
    action === OtpAction.ForgotPassword ? forgotExpirySeconds : signupExpirySeconds;

  const expiryMinutes = Math.floor(expirySeconds / 60);

  const subject =
    action === OtpAction.ForgotPassword
      ? `${APP_NAME} – Password Reset OTP`
      : `${APP_NAME} – Verify Your Email`;

  const mailOptions = {
    from: `${APP_NAME} <${ENV.SMTP.USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <p style="font-size: 16px; color: #666;">
          ${
            action === OtpAction.ForgotPassword
              ? 'Use the OTP below to reset your password.'
              : 'Use the OTP below to complete your signup.'
          }
        </p>

        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; border-radius: 6px;">
          <h1 style="color: #007bff; letter-spacing: 6px; margin: 0;">
            ${otp}
          </h1>
        </div>

        <p style="font-size: 14px; color: #999;">
          This code will expire in <strong>${expiryMinutes} minutes</strong>.
          Please do not share this code with anyone.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
