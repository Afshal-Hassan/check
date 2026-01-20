// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class AddIndexesToUserRelations1768908760771 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // -------------------- user_interests --------------------
//     await queryRunner.query(`
//       CREATE INDEX IF NOT EXISTS idx_user_interests_user_id
//       ON user_interests(user_id);
//     `);
//     await queryRunner.query(`
//       CREATE INDEX IF NOT EXISTS idx_user_interests_interest_id
//       ON user_interests(interest_id);
//     `);
//     await queryRunner.query(`
//       CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_interest
//       ON user_interests(user_id, interest_id);
//     `);

//     // -------------------- user_languages --------------------
//     await queryRunner.query(`
//       CREATE INDEX IF NOT EXISTS idx_user_languages_user_id
//       ON user_languages(user_id);
//     `);
//     await queryRunner.query(`
//       CREATE INDEX IF NOT EXISTS idx_user_languages_language_id
//       ON user_languages(language_id);
//     `);
//     await queryRunner.query(`
//       CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_language
//       ON user_languages(user_id, language_id);
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // -------------------- user_interests --------------------
//     await queryRunner.query(`DROP INDEX IF EXISTS uniq_user_interest;`);
//     await queryRunner.query(`DROP INDEX IF EXISTS idx_user_interests_user_id;`);
//     await queryRunner.query(`DROP INDEX IF EXISTS idx_user_interests_interest_id;`);

//     // -------------------- user_languages --------------------
//     await queryRunner.query(`DROP INDEX IF EXISTS uniq_user_language;`);
//     await queryRunner.query(`DROP INDEX IF EXISTS idx_user_languages_user_id;`);
//     await queryRunner.query(`DROP INDEX IF EXISTS idx_user_languages_language_id;`);
//   }
// }
