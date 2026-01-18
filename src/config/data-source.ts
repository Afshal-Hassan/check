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

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST || 'database-1.cnqgigacmiss.eu-north-1.rds.amazonaws.com',
  // port: Number(process.env.DB_PORT) || 5432,
  // username: process.env.DB_USERNAME || 'postgres',
  // password: process.env.DB_PASSWORD || 'iTcjzyDi2WeqHX8',
  // database: process.env.DB_DATABASE || 'look-a-like-match',
  entities: [
    Role,
    User,
    UserPhoto,
    UserProfile,
    Prompt,
    Interest,
    LifestylePreference,
    DatingPreference,
    Language,
  ],
  synchronize: true,
  ssl: false,

  migrations: [path.join(__dirname, '..', '..', 'migrations', '*.ts')],
  subscribers: [],
});
