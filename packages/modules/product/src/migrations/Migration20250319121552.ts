import { Migration } from '@mikro-orm/migrations';

export class Migration20250319121552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "brand" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_deleted_at" ON "brand" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "product" add column if not exists "brand_id" text null;`);
    this.addSql(`alter table if exists "product" add constraint "product_brand_id_foreign" foreign key ("brand_id") references "brand" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_brand_id" ON "product" (brand_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product" drop constraint if exists "product_brand_id_foreign";`);

    this.addSql(`drop table if exists "brand" cascade;`);

    this.addSql(`drop index if exists "IDX_product_brand_id";`);
    this.addSql(`alter table if exists "product" drop column if exists "brand_id";`);
  }

}
