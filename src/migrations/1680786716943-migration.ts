import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1680786716943 implements MigrationInterface {
    name = 'migration1680786716943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test" ("id" SERIAL NOT NULL, "creatorId" character varying NOT NULL, "time" character varying NOT NULL, "accuracy" character varying NOT NULL, "wpm" integer NOT NULL, "chars" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "testTaken" character varying NOT NULL, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_ab6d476e7698322a3a35b5fdb12" FOREIGN KEY ("creatorId") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_ab6d476e7698322a3a35b5fdb12"`);
        await queryRunner.query(`DROP TABLE "test"`);
    }

}
