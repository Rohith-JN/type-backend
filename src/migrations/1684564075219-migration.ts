import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684564075219 implements MigrationInterface {
    name = 'migration1684564075219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test" ("id" SERIAL NOT NULL, "creatorId" character varying NOT NULL, "time" character varying NOT NULL, "accuracy" double precision NOT NULL, "wpm" integer NOT NULL, "rawWpm" integer NOT NULL, "chars" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "testTaken" character varying NOT NULL, "typedWordDataset" text array NOT NULL, "wordNumberLabels" integer array NOT NULL, "wpmDataset" integer array NOT NULL, "incorrectCharsDataset" integer array NOT NULL, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_df955cae05f17b2bcf5045cc021" UNIQUE ("uid"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test" ADD CONSTRAINT "FK_ab6d476e7698322a3a35b5fdb12" FOREIGN KEY ("creatorId") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP CONSTRAINT "FK_ab6d476e7698322a3a35b5fdb12"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "test"`);
    }

}
