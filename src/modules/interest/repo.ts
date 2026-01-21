import { EntityManager } from 'typeorm';

export const save = async (
  data: {
    userId: string;
    interests: string[];
  },
  manager: EntityManager,
): Promise<void> => {
  const { userId, interests: interestNames } = data;

  if (interestNames.length === 0) return;

  try {
    await manager.query(
      `
      INSERT INTO interests (id, name)
      VALUES ${interestNames.map((_, i) => `(gen_random_uuid(), $${i + 1})`).join(', ')}
      ON CONFLICT (name) DO NOTHING
      `,
      interestNames,
    );

    await manager.query(
      `
      DELETE FROM user_interests 
      WHERE user_id = $1
      `,
      [userId],
    );

    await manager.query(
      `
      INSERT INTO user_interests (user_id, interest_id)
      SELECT $1, id 
      FROM interests 
      WHERE name = ANY($2)
      ON CONFLICT DO NOTHING
      `,
      [userId, interestNames],
    );
  } catch (error: any) {
    throw new Error(`Failed to save interests: ${error.message}`);
  }
};
