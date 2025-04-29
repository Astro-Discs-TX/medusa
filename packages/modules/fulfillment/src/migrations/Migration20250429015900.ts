import { Migration } from "@mikro-orm/migrations"

export class Migration20250429015900 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'CREATE INDEX IF NOT EXISTS IDX_geo_zone_postal_expression ON "geo_zone" USING GIN ("postal_expression" jsonb_path_ops);'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_geo_zone_postal_expression";')
  }
}
