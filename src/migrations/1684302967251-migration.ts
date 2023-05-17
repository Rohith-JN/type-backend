import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684302967251 implements MigrationInterface {
    name = 'migration1684302967251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "incorrectCharsDataset"`);
        await queryRunner.query(`ALTER TABLE "test" ADD "incorrectCharsDataset" integer array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "incorrectCharsDataset"`);
        await queryRunner.query(`ALTER TABLE "test" ADD "incorrectCharsDataset" jsonb array NOT NULL`);
    }

}
