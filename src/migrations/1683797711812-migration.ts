import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1683797711812 implements MigrationInterface {
    name = 'migration1683797711812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" RENAME COLUMN "chars" TO "words"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" RENAME COLUMN "words" TO "chars"`);
    }

}
