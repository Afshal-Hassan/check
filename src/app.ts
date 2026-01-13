import cors from 'cors';
import express from 'express';
import { globalErrorHandler } from '@/middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* *****   Health Check   ***** */
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

/* *****   Global Error   ***** */
app.use(globalErrorHandler);

export default app;
