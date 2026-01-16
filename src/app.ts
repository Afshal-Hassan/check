import cors from 'cors';
import express from 'express';
import otpRoutes from '@/modules/otp/route';
import userRoutes from '@/modules/user/route';
import authRoutes from '@/modules/auth/route';
import { globalErrorHandler } from '@/middleware';
import interestRoutes from '@/modules/interest/route';
import userPromptRoutes from '@/modules/user-prompt/route';
import userProfileRoutes from '@/modules/user-profile/route';
import datingPreferenceRoutes from '@/modules/dating-preference/route';
import lifestylePreferenceRoutes from '@/modules/lifestyle-preference/route';

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
app.use('/user', userRoutes);
app.use('/otp', otpRoutes);
app.use('/interest', interestRoutes);
app.use('/user-prompt', userPromptRoutes);
app.use('/user-profile', userProfileRoutes);
app.use('/dating-preference', datingPreferenceRoutes);
app.use('/lifestyle-preference', lifestylePreferenceRoutes);

/* *****   Global Error   ***** */
app.use(globalErrorHandler);

export default app;
