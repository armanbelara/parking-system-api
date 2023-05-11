import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_spot_entrances', (table) => {
    table.id();
    table.foreignId('parking_spot_id', 'parking_spots');
    table.foreignId('parking_entrance_id', 'parking_entrances');
    table.integer('distance');
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_spot_entrances');
}
