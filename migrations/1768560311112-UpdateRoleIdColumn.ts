import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleIdColumn1768560311112 implements MigrationInterface {
  name = 'UpdateRoleIdColumn1768560311112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1" UNIQUE ("role_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a2cecd1a3531c0b041e29ba46e1" UNIQUE ("role_id")`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id")`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
