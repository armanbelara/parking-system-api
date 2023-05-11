import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_types', (table) => {
    table.id();
    table.varchar('code');
    table.varchar('name');
    table.integer('first_3hrs_fee');
    table.integer('succeeding_hrs_fee');
    table.integer('exceed_24hrs_fee');
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_types');
}
