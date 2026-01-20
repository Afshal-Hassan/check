import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { DataSource } from 'typeorm';
import { Role } from '@/modules/role/model';
import { User } from '@/modules/user/model';
import { Prompt } from '@/modules/prompt/model';
import { Interest } from '@/modules/interest/model';
import { Language } from '@/modules/language/model';
import { UserPhoto } from '@/modules/user-photo/model';
import { UserProfile } from '@/modules/user-profile/model';
import { DatingPreference } from '@/modules/dating-preference/model';
import { LifestylePreference } from '@/modules/lifestyle-preference/model';
import { UserPrompt } from '@/modules/user-prompt/model';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Role,
    User,
    UserPhoto,
    UserProfile,
    Prompt,
    UserPrompt,
    Interest,
    LifestylePreference,
    DatingPreference,
    Language,
  ],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },

  migrations: [path.join(__dirname, isProd ? '../migrations/*.js' : '../../migrations/*.ts')],
  subscribers: [],
});
