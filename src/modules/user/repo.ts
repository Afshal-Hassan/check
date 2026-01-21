import { User } from './model';
import { EntityManager, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/config/data-source';

export const UserRepository = AppDataSource.getRepository(User);

export const findUserAndProfilePictureById = async (userId: string) => {
  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .leftJoin('user_photos', 'photo', 'photo.user_id = user.id AND photo.is_primary = :isPrimary', {
      isPrimary: true,
    })
    .addSelect(['photo.id', 'photo.user_id', 'photo.s3_key', 'photo.is_primary'])
    .where('user.id = :userId', { userId })
    .getRawOne();

  if (!result) return null;

  return {
    id: result.user_id,
    hasProfilePicture: !!result.photo_id,
    photo: result.photo_id
      ? {
          id: result.photo_id,
          userId: result.photo_user_id,
          s3Key: result.photo_s3_key,
          isPrimary: result.photo_is_primary,
        }
      : null,
  };
};

export const findUserAndProfileById = async (userId: string) => {
  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .leftJoin('user_profiles', 'profile', 'profile.user_id = user.id')
    .addSelect(['profile.id'])
    .where('user.id = :userId', { userId })
    .getRawOne();

  if (!result) return null;

  return {
    id: result.user_id,
    hasProfile: !!result.profile_id,
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({ where: { email } });
};

export const findActiveUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({
    where: {
      email,
      isSuspended: false,
    },
  });
};

export const findActiveUserByEmailAndRole = async (email: string, role: string) => {
  const qb = AppDataSource.createQueryBuilder(User, 'u')
    /* ===================== JOINS ===================== */

    // Role
    .innerJoin('u.role', 'r')

    // Profile
    .leftJoin('user_profiles', 'up', 'up.user_id = u.id')

    // Interests (many-to-many)
    .leftJoin('user_interests', 'ui', 'ui.user_id = u.id')
    .leftJoin('interests', 'i', 'i.id = ui.interest_id')

    // Lifestyle
    .leftJoin('lifestyle_preferences', 'lp', 'lp.user_id = u.id')

    // Dating preference
    .leftJoin('dating_preferences', 'dp', 'dp.user_id = u.id')

    // Prompts
    .leftJoin('user_prompts', 'upm', 'upm.user_id = u.id')
    .leftJoin('prompts', 'p', 'p.id = upm.prompt_id')

    // Photos
    .leftJoin('user_photos', 'uph', 'uph.user_id = u.id')

    /* ===================== FILTERS ===================== */

    .where('u.email = :email', { email })
    .andWhere('u.is_suspended = false')
    .andWhere('r.name = :role', { role: role.toUpperCase() })

    /* ===================== SELECT ===================== */

    .select([
      /* ---------- USER ---------- */
      'u.id AS "userId"',
      'u.full_name AS "fullName"',
      'u.email AS "email"',
      'u.password_hash AS "passwordHash"',
      'u.country AS "country"',
      'u.state AS "state"',
      'u.city AS "city"',
      'u.auth_type AS "authType"',
      'u.is_verified AS "isVerified"',
      'u.is_suspended AS "isSuspended"',

      /* ---------- PROFILE ---------- */
      'up.bio_en AS "bioEn"',
      'up.bio_fr AS "bioFr"',
      'up.bio_es AS "bioEs"',
      'up.bio_ar AS "bioAr"',
      'up.height_en AS "heightEn"',
      'up.height_fr AS "heightFr"',
      'up.height_es AS "heightEs"',
      'up.height_ar AS "heightAr"',
      'up.date_of_birth AS "dateOfBirth"',
      'up.occupation AS "occupation"',
      'up.gender AS "gender"',
      'up.body_type AS "bodyType"',
      'up.relationship_status AS "relationshipStatus"',
      'up.children_preference AS "childrenPreference"',

      /* ---------- INTERESTS ---------- */
      `
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', i.id,
            'name', i.name
          )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS "interests"
      `,

      /* ---------- LIFESTYLE ---------- */
      'lp.smoking AS "smoking"',
      'lp.political_views AS "politicalViews"',
      'lp.diet AS "diet"',
      'lp.workout_routine AS "workoutRoutine"',

      /* ---------- DATING ---------- */
      'dp.min_age AS "minAge"',
      'dp.max_age AS "maxAge"',
      'dp.interested_in AS "interestedIn"',
      'dp.looking_for AS "lookingFor"',

      /* ---------- PROMPTS ---------- */
      `
      COALESCE(
  json_agg(
    DISTINCT jsonb_build_object(
      'id', p.id,
      'questionEn', p.question_en,
      'questionFr', p.question_fr,
      'questionEs', p.question_es,
      'questionAr', p.question_ar,
      'answerEn', upm.answer_en,
      'answerFr', upm.answer_fr,
      'answerEs', upm.answer_es,
      'answerAr', upm.answer_ar
    )
  ) FILTER (WHERE p.id IS NOT NULL),
  '[]'
) AS "prompts"
      `,

      /* ---------- PHOTOS ---------- */
      `
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', uph.id,
             'image', :cdn || '/' || uph.s3_key,
            'isPrimary', uph.is_primary
          )
        ) FILTER (WHERE uph.id IS NOT NULL),
        '[]'
      ) AS "photos"
      `,
    ])

    /* ===================== GROUP BY ===================== */

    .groupBy(
      `
      u.id,
      r.id,
      up.id,
      lp.id,
      dp.id
    `,
    )

    /* ===================== PARAMS ===================== */

    .setParameter('cdn', process.env.AWS_CLOUDFRONT_URL)

    /* ===================== LIMIT ===================== */

    .limit(1);

  const result = await qb.getRawOne();
  if (!result) return null;

  /* ===================== MAPPING ===================== */

  return {
    id: result.userId,
    email: result.email,
    fullName: result.fullName,
    passwordHash: result.passwordHash,
    country: result.country,
    state: result.state,
    city: result.city,
    authType: result.authType,
    isVerified: result.isVerified,
    isSuspended: result.isSuspended,

    profile:
      result.bioEn === null
        ? null
        : {
            bioEn: result.bioEn,
            bioFr: result.bioFr,
            bioEs: result.bioEs,
            bioAr: result.bioAr,
            heightEn: result.heightEn,
            heightFr: result.heightFr,
            heightEs: result.heightEs,
            heightAr: result.heightAr,
            dateOfBirth: result.dateOfBirth,
            occupation: result.occupation,
            gender: result.gender,
            bodyType: result.bodyType,
            relationshipStatus: result.relationshipStatus,
            childrenPreference: result.childrenPreference,
          },

    interests: result.interests.length === 0 ? null : result.interests,

    lifestylePreference:
      result.smoking === null
        ? null
        : {
            smoking: result.smoking,
            politicalViews: result.politicalViews,
            diet: result.diet,
            workoutRoutine: result.workoutRoutine,
          },

    datingPreference:
      result.minAge === null
        ? null
        : {
            minAge: result.minAge,
            maxAge: result.maxAge,
            interestedIn: result.interestedIn,
            lookingFor: result.lookingFor,
          },

    prompts: result.prompts.length === 0 ? null : result.prompts,

    photos: result.photos.length === 0 ? null : result.photos,
  };
};

export const save = async (userData: Partial<User>): Promise<User> => {
  const user = UserRepository.create(userData);
  return UserRepository.save(user);
};

export const findUsers = async (
  page = 1,
  isVerified?: boolean,
  isSuspended?: boolean,
): Promise<{ data: any[]; total: number }> => {
  const queryBuilder = AppDataSource.createQueryBuilder()
    .select([
      'u.id AS "userId"',
      'u.email AS "email"',
      'up.gender AS "gender"',
      'up.occupation AS "occupation"',
      `DATE_PART('year', AGE(up."date_of_birth")) AS "age"`,
      `COUNT(*) OVER() AS "total_count"` /* total count over the filtered rows */,
    ])
    .from('users', 'u')
    .leftJoin('user_profiles', 'up', 'up."user_id" = u.id')
    .where('u.role_id = 2');

  // Conditional queries
  if (isVerified !== undefined) {
    queryBuilder.andWhere('u."is_verified" = :isVerified', { isVerified });
  }
  if (isSuspended !== undefined) {
    queryBuilder.andWhere('u."is_suspended" = :isSuspended', { isSuspended });
  }

  /* Pagination */
  queryBuilder.offset((page - 1) * 10).limit(10);

  const rawData = await queryBuilder.getRawMany();

  const total = rawData.length > 0 ? Number(rawData[0].total_count) : 0;

  const data = rawData.map((row) => ({
    userId: row.userId,
    email: row.email,
    gender: row.gender,
    occupation: row.occupation,
    age: Number(row.age),
  }));

  return { data, total };
};

export const updatePasswordByEmail = async (
  email: string,
  hashedPassword: string,
): Promise<UpdateResult> => {
  return UserRepository.update({ email }, { passwordHash: hashedPassword });
};

export const updateLocationById = async (
  userId: string,
  userData: Partial<User>,
  manager: EntityManager,
): Promise<User> => {
  const repo = manager ? manager.getRepository(User) : UserRepository;

  const user = await repo.preload({
    id: userId,
    ...userData,
  });

  if (!user) throw new Error('User not found');

  return repo.save(user);
};
