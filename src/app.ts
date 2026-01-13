import cors from 'cors';
import express from 'express';
import { globalErrorHandler } from '@/middleware';
import otpRoutes from '@/modules/otp/route';
import authRoutes from '@/modules/auth/route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* *****   Health Check   ***** */
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

/* *****   Routes   ***** */
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);

/* *****   Global Error   ***** */
app.use(globalErrorHandler);

export default app;
