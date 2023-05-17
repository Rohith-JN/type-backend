import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684256605779 implements MigrationInterface {
    name = 'migration1684256605779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "typedWordDataset" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test" ADD "wordNumberLabels" integer array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test" ADD "wpmDataset" integer array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "test" ADD "incorrectCharsDataset" jsonb array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "incorrectCharsDataset"`);
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "wpmDataset"`);
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "wordNumberLabels"`);
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "typedWordDataset"`);
    }

}
