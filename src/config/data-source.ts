import { DataSource } from 'typeorm';
import { User } from '@/modules/user/model';
import { Interest } from '@/modules/interest/model';
import { UserPhoto } from '@/modules/user-photo/model';
import { UserProfile } from '@/modules/user-profile/model';
import { DatingPreference } from '@/modules/dating-preference/model';
import { LifestylePreference } from '@/modules/lifestyle-preference/model';
import { UserProfileTranslation } from '@/modules/user-profile/model.translation';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  //   host: process.env.DB_HOST,
  //   port: Number(process.env.DB_PORT),
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  entities: [
    User,
    UserPhoto,
    UserProfile,
    UserProfileTranslation,
    Interest,
    LifestylePreference,
    DatingPreference,
  ],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
