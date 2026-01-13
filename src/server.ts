import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import app from '@/app';
import { AppDataSource } from '@/data-source';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB Connection error:', err));
