import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInitialPrompts1768977983637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO prompts (id, question_en, question_fr, question_es, question_ar)
      VALUES
      (
        uuid_generate_v4(),
        'My ideal Sunday includes...',
        'Mon dimanche idéal comprend...',
        'Mi domingo ideal incluye...',
        'يومي المثالي يوم الأحد يشمل...'
      ),
      (
        uuid_generate_v4(),
        'I’m looking for someone who...',
        'Je cherche quelqu’un qui...',
        'Busco a alguien que...',
        'أبحث عن شخص...'
      ),
      (
        uuid_generate_v4(),
        'The key to my heart is...',
        'La clé de mon cœur est...',
        'La clave de mi corazón es...',
        'مفتاح قلبي هو...'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM prompts
      WHERE question_en IN (
        'My ideal Sunday includes...',
        'I’m looking for someone who...',
        'The key to my heart is...'
      );
    `);
  }
}
