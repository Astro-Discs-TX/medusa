import { Migration } from '@mikro-orm/migrations';

export class Migration20250311124115 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "user" drop constraint if exists "user_email_unique";`);
    this.addSql(`create table if not exists "user" ("id" text not null, "email" text not null, "fullName" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "user" (email) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
