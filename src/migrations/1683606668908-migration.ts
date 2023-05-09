import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1683606668908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "test" 
        SET "accuracy" = REPLACE("accuracy", '%', '')::float 
        WHERE "accuracy" LIKE '%\%%'
      `);
    await queryRunner.query(`
        ALTER TABLE "test" 
        ALTER COLUMN "accuracy" TYPE float USING "accuracy"::float
      `);
  }

  public async down(): Promise<void> {}
}
