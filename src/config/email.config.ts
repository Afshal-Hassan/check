import { ENV } from './env.config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  //   host: process.env.SMTP_HOST || 'smtp.gmail.com',
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.SMTP.USER,
    pass: ENV.SMTP.PASSWORD,
  },
});

transporter.verify((error: any, success: any) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready');
  }
});
