import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('vehicles', (table) => {
    table.id();
    table.varchar('plate_number').unique();
    table.foreignId('vehicle_type_id', 'vehicle_types');
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('vehicle_types');
}
