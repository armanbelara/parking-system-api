import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_entrances', (table) => {
    table.id();
    table.varchar('name');
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_entrances');
}
