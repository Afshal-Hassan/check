import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  //   host: process.env.SMTP_HOST || 'smtp.gmail.com',
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASSWORD, // Use App Password for Gmail
  },
});

transporter.verify((error: any, success: any) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready');
  }
});
