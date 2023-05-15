import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684125141688 implements MigrationInterface {
    name = 'migration1684125141688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" RENAME COLUMN "words" TO "chars"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" RENAME COLUMN "chars" TO "words"`);
    }

}
