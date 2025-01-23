import { Migration } from "@mikro-orm/migrations"

export class Migration20250113122235 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
<<<<<<< HEAD
      SET value = '"true"'
=======
      SET value = 'true'::jsonb
>>>>>>> 5aa47978734b4deae5139a4fd5eba15fd20cb874
      WHERE value = '"\\"true\\""';
    `)
    this.addSql(`
      UPDATE shipping_option_rule
<<<<<<< HEAD
      SET value = '"false"'
=======
      SET value = 'false'::jsonb
>>>>>>> 5aa47978734b4deae5139a4fd5eba15fd20cb874
      WHERE value = '"\\"false\\""';
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"\\"true\\""'
<<<<<<< HEAD
      WHERE value = '"true"';
=======
      WHERE value = 'true'::jsonb;
>>>>>>> 5aa47978734b4deae5139a4fd5eba15fd20cb874
    `)
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"\\"false\\""'
<<<<<<< HEAD
      WHERE value = '"false"';
=======
      WHERE value = 'false'::jsonb;
>>>>>>> 5aa47978734b4deae5139a4fd5eba15fd20cb874
    `)
  }
}
