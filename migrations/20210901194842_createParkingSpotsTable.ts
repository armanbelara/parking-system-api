import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_spots', (table) => {
    table.id();
    table.foreignId('parking_type_id', 'parking_types');
    table.boolean('is_occupied').default(false);
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_spots');
}
