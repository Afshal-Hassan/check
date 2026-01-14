import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import app from '@/app';
import { AppDataSource } from '@/config/data-source';
import { connectRedis } from '@/config/redis.config';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log('Database Connected');

    await connectRedis();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB Connection error:', err));
