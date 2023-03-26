import { Migration } from '@mikro-orm/migrations';

export class Migration20230326162552 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "test" ("id" serial primary key, "created_at" timestamptz(0) not null, "time" varchar(255) not null, "accuracy" varchar(255) not null, "wpm" int not null, "words" text not null);');

    this.addSql('alter table "user" add column "uid" text not null, add column "email" text not null;');
    this.addSql('alter table "user" drop constraint "user_password_unique";');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "test" cascade;');

    this.addSql('alter table "user" drop constraint "user_email_unique";');
    this.addSql('alter table "user" drop column "uid";');
    this.addSql('alter table "user" drop column "email";');
    this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');
  }

}
