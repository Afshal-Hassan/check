import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { ENV } from './env.config';
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
import { Reaction } from '@/modules/reaction/model';
import { Match } from '@/modules/match/model';

const isProd = ENV.APP.ENVIRONMENT === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // url: ENV.DATABASE.URL,
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  username: ENV.DATABASE.USERNAME,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.NAME,
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
    Reaction,
    Match,
  ],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },

  migrations: [path.join(__dirname, isProd ? '../migrations/*.js' : '../../migrations/*.ts')],
  subscribers: [],
});
