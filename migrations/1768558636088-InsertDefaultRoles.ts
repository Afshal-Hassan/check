import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertDefaultRoles1768558636088 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (id, name) 
      VALUES 
        (1, 'ADMIN'),
        (2, 'USER')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM roles WHERE name IN ('ADMIN', 'USER');
    `);
  }
}
