import { User } from './model';
import { EntityManager, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/config/data-source';
import { ENV } from '@/config/env.config';

export const UserRepository = AppDataSource.getRepository(User);

export const findUsers = async (page = 1, isVerified?: boolean, isSuspended?: boolean) => {
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

  return rawData;
};

export const findActiveUserById = async (userId: string) => {
  const query = `
    SELECT
      /* ---------- USER ---------- */
      u.id AS "userId",
      u.full_name AS "fullName",
      u.email AS "email",
      u.country AS "country",
      u.state AS "state",
      u.city AS "city",
      u.auth_type AS "authType",
      u.is_verified AS "isVerified",
      u.is_onboarded AS "isOnboarded",
      u.is_suspended AS "isSuspended",

      /* ---------- PROFILE ---------- */
      up.bio_en AS "bioEn",
      up.bio_fr AS "bioFr",
      up.bio_es AS "bioEs",
      up.bio_ar AS "bioAr",
      up.height AS "height",
      up.unit AS "unit",
      up.date_of_birth AS "dateOfBirth",
      up.occupation AS "occupation",
      up.gender AS "gender",
      up.body_type AS "bodyType",
      up.relationship_status AS "relationshipStatus",
      up.children_preference AS "childrenPreference",

      /* ---------- INTERESTS ---------- */
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', i.id,
            'name', i.name
          )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS "interests",

      /* ---------- LIFESTYLE ---------- */
      lp.smoking AS "smoking",
      lp.political_views AS "politicalViews",
      lp.diet AS "diet",
      lp.workout_routine AS "workoutRoutine",

      /* ---------- DATING ---------- */
      dp.min_age AS "minAge",
      dp.max_age AS "maxAge",
      dp.interested_in AS "interestedIn",
      dp.looking_for AS "lookingFor",

      /* ---------- PROMPTS ---------- */
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
      ) AS "prompts",

      /* ---------- PHOTOS ---------- */
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', uph.id,
            'image', $2 || '/' || uph.s3_key,
            'isPrimary', uph.is_primary
          )
        ) FILTER (WHERE uph.id IS NOT NULL),
        '[]'
      ) AS "photos"

    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    LEFT JOIN user_profiles up ON up.user_id = u.id
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    LEFT JOIN lifestyle_preferences lp ON lp.user_id = u.id
    LEFT JOIN dating_preferences dp ON dp.user_id = u.id
    LEFT JOIN user_prompts upm ON upm.user_id = u.id
    LEFT JOIN prompts p ON p.id = upm.prompt_id
    LEFT JOIN user_photos uph ON uph.user_id = u.id

    WHERE u.role_id = 2
      AND u.id = $1

    GROUP BY u.id, r.id, up.id, lp.id, dp.id
    LIMIT 1
  `;

  const result = await AppDataSource.query(query, [
    userId, // $1
    ENV.AWS.CLOUDFRONT.URL, // $2
  ]);

  return result[0] ?? null;
};

export const findUserAndVerifiedPictureById = async (userId: string) => {
  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .leftJoin(
      'user_photos',
      'photo',
      'photo.user_id = user.id AND photo.is_verified = :isVerified',
      {
        isVerified: true,
      },
    )
    .addSelect(['photo.id', 'photo.user_id', 'photo.s3_key', 'photo.is_verified'])
    .where('user.id = :userId', { userId })
    .getRawOne();

  return result;
};

export const findActiveUsersById = async (
  userId: string,
  userIds: string[],
  filters: {
    page?: number;
    interestedIn?: string;
    minAge?: number;
    maxAge?: number;
    minHeightCm?: number;
    maxHeightCm?: number;
    minHeightFt?: number;
    maxHeightFt?: number;
  },
) => {
  if (!userIds || userIds.length === 0) {
    return [];
  }

  const offset = ((filters.page || 1) - 1) * 10;

  const query = `
    SELECT
      u.id AS "userId",
      u.full_name AS "fullName",
      u.email AS "email",
      u.country AS "country",
      u.state AS "state",
      u.city AS "city",
      u.auth_type AS "authType",
      u.is_verified AS "isVerified",
      u.is_onboarded AS "isOnboarded",
      u.is_suspended AS "isSuspended",

      up.bio_en AS "bioEn",
      up.bio_fr AS "bioFr",
      up.bio_es AS "bioEs",
      up.bio_ar AS "bioAr",
      up.height AS "height",
      up.unit AS "unit",
      up.date_of_birth AS "dateOfBirth",
      up.occupation AS "occupation",
      up.gender AS "gender",
      up.body_type AS "bodyType",
      up.relationship_status AS "relationshipStatus",
      up.children_preference AS "childrenPreference",

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', i.id, 'name', i.name)
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS "interests",

      lp.smoking AS "smoking",
      lp.political_views AS "politicalViews",
      lp.diet AS "diet",
      lp.workout_routine AS "workoutRoutine",

      dp.min_age AS "minAge",
      dp.max_age AS "maxAge",
      dp.interested_in AS "interestedIn",
      dp.looking_for AS "lookingFor",

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
      ) AS "prompts",

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', uph.id,
            'image', $1 || '/' || uph.s3_key,
            'isPrimary', uph.is_primary
          )
        ) FILTER (WHERE uph.id IS NOT NULL),
        '[]'
      ) AS "photos"

    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    LEFT JOIN user_profiles up ON up.user_id = u.id
    LEFT JOIN dating_preferences cdp ON cdp.user_id = $2
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    LEFT JOIN lifestyle_preferences lp ON lp.user_id = u.id
    LEFT JOIN dating_preferences dp ON dp.user_id = u.id
    LEFT JOIN user_prompts upm ON upm.user_id = u.id
    LEFT JOIN prompts p ON p.id = upm.prompt_id
    LEFT JOIN user_photos uph ON uph.user_id = u.id 
      AND (uph.is_verified = false OR uph.is_verified IS NULL)
    LEFT JOIN reactions reac ON reac.reaction_giver_id = $2
      AND reac.reaction_receiver_id = u.id

    WHERE u.role_id = 2
      AND u.is_suspended = false
      AND u.id = ANY($3)
      AND reac.id IS NULL

      -- 1. Other user's gender matches my interest
      AND (
        cdp.interested_in = 'everyone'
        OR up.gender = cdp.interested_in
        OR up.gender = 'prefer_not_to_say'
      )

    -- 2. Other user's interest matches my gender
      AND (
        dp.interested_in IS NULL
        OR dp.interested_in = 'everyone'
        OR dp.interested_in = cdp.gender
        OR cdp.gender = 'prefer_not_to_say'
      )

      AND DATE_PART('year', AGE(up.date_of_birth)) 
          BETWEEN COALESCE($5, cdp.min_age) AND COALESCE($6, cdp.max_age)
      AND (
        (up.unit = 'cm' AND 
          ( ($7::numeric IS NULL OR up.height >= $7::numeric) AND ($8::numeric IS NULL OR up.height <= $8::numeric) )
        )
        OR
        (up.unit = 'ft' AND 
          ( ($9::numeric IS NULL OR up.height >= $9::numeric) AND ($10::numeric IS NULL OR up.height <= $10::numeric) )
        )
      )

    GROUP BY u.id, r.id, up.id, lp.id, dp.id
    ORDER BY array_position($3, u.id)
    LIMIT 10
    OFFSET $11
  `;

  console.log(filters);

  const result = await AppDataSource.query(query, [
    ENV.AWS.CLOUDFRONT.URL, // $1 CDN
    userId, // $2 current user
    userIds, // $3 userIds filter
    filters.interestedIn ?? null, // $4 interestedIn
    filters.minAge ?? null, // $5 minAge
    filters.maxAge ?? null, // $6 maxAge
    filters.minHeightCm ?? null, // $7
    filters.maxHeightCm ?? null, // $8
    filters.minHeightFt ?? null, // $9
    filters.maxHeightFt ?? null, // $10
    offset, // $11 pagination offset
  ]);

  return result;
};

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

  return result;
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
  const query = `
    SELECT
      /* ---------- USER ---------- */
      u.id AS "userId",
      u.full_name AS "fullName",
      u.email AS "email",
      u.password_hash AS "passwordHash",
      u.country AS "country",
      u.state AS "state",
      u.city AS "city",
      u.auth_type AS "authType",
      u.is_verified AS "isVerified",
      u.is_onboarded AS "isOnboarded",
      u.is_suspended AS "isSuspended",

      /* ---------- PROFILE ---------- */
      up.bio_en AS "bioEn",
      up.bio_fr AS "bioFr",
      up.bio_es AS "bioEs",
      up.bio_ar AS "bioAr",
      up.height AS "height",
      up.unit AS "unit",
      up.date_of_birth AS "dateOfBirth",
      up.occupation AS "occupation",
      up.gender AS "gender",
      up.body_type AS "bodyType",
      up.relationship_status AS "relationshipStatus",
      up.children_preference AS "childrenPreference",

      /* ---------- INTERESTS ---------- */
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', i.id,
            'name', i.name
          )
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS "interests",

      /* ---------- LIFESTYLE ---------- */
      lp.smoking AS "smoking",
      lp.political_views AS "politicalViews",
      lp.diet AS "diet",
      lp.workout_routine AS "workoutRoutine",

      /* ---------- DATING ---------- */
      dp.min_age AS "minAge",
      dp.max_age AS "maxAge",
      dp.interested_in AS "interestedIn",
      dp.looking_for AS "lookingFor",

      /* ---------- PROMPTS ---------- */
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
      ) AS "prompts",

      /* ---------- PHOTOS ---------- */
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', uph.id,
            'image', $3 || '/' || uph.s3_key,
            'isPrimary', uph.is_primary
          )
        ) FILTER (WHERE uph.id IS NOT NULL),
        '[]'
      ) AS "photos"

    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    LEFT JOIN user_profiles up ON up.user_id = u.id
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    LEFT JOIN lifestyle_preferences lp ON lp.user_id = u.id
    LEFT JOIN dating_preferences dp ON dp.user_id = u.id
    LEFT JOIN user_prompts upm ON upm.user_id = u.id
    LEFT JOIN prompts p ON p.id = upm.prompt_id
    LEFT JOIN user_photos uph ON uph.user_id = u.id

    WHERE u.email = $1
      AND r.name = $2

    GROUP BY u.id, r.id, up.id, lp.id, dp.id
    LIMIT 1
  `;

  const result = await AppDataSource.query(query, [
    email, // $1
    role.toUpperCase(), // $2
    ENV.AWS.CLOUDFRONT.URL, // $3
  ]);

  return result[0] ?? null;
};

export const save = async (userData: Partial<User>): Promise<User> => {
  const user = UserRepository.create(userData);
  return UserRepository.save(user);
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

export const updateIsVerifiedById = async (
  userId: string,
  manager: EntityManager,
): Promise<UpdateResult> => {
  const repo = manager.getRepository(User);

  return repo.update({ id: userId }, { isVerified: true });
};

export const updateIsOnboardedById = async (
  userId: string,
  manager: EntityManager,
): Promise<UpdateResult> => {
  const repo = manager.getRepository(User);

  return repo.update({ id: userId }, { isOnboarded: true });
};
