import { EntityManager } from 'typeorm';

export const save = async (
  data: {
    userId: string;
    languages: string[];
  },
  manager: EntityManager,
): Promise<void> => {
  const { userId, languages } = data;

  if (languages.length === 0) return;

  try {
    await manager.query(
      `
      INSERT INTO languages (id, name)
      VALUES ${languages.map((_, i) => `(gen_random_uuid(), $${i + 1})`).join(', ')}
      ON CONFLICT (name) DO NOTHING
      `,
      languages,
    );

    await manager.query(
      `
      DELETE FROM user_languages 
      WHERE user_id = $1
      `,
      [userId],
    );

    await manager.query(
      `
      INSERT INTO user_languages (user_id, language_id)
      SELECT $1, id
      FROM languages
      WHERE name = ANY($2)
      ON CONFLICT DO NOTHING
      `,
      [userId, languages],
    );
  } catch (error: any) {
    throw new Error(`Failed to save languages: ${error.message}`);
  }
};
