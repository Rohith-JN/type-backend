import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684127363060 implements MigrationInterface {
    name = 'migration1684127363060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "rawWpm" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "rawWpm"`);
    }

}
