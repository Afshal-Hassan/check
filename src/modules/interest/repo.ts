import { AppDataSource } from '@/config/data-source';

export const save = async (userId: string, interestNames: string[]): Promise<void> => {
  if (interestNames.length === 0) return;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.query(
      `
      INSERT INTO interests (id, name)
      VALUES ${interestNames.map((_, i) => `(gen_random_uuid(), $${i + 1})`).join(', ')}
      ON CONFLICT (name) DO NOTHING
      `,
      interestNames,
    );

    await queryRunner.query(
      `
      INSERT INTO user_interests (user_id, interest_id)
      SELECT $1, id 
      FROM interests 
      WHERE name = ANY($2)
      ON CONFLICT DO NOTHING
      `,
      [userId, interestNames],
    );
  } finally {
    await queryRunner.release();
  }
};
