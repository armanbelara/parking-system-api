import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_tickets', (table) => {
    table.id();
    table.foreignId('vehicle_id', 'vehicles');
    table.varchar('payment_status').default('UNPAID').notNull();
    table.integer('total_fee');
    table.integer('total_hours');
    table.datetime('start_datetime');
    table.datetime('end_datetime');
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_tickets');
}
