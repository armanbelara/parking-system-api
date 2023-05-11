import { Schema } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

export async function up(schema: Schema) {
  await schema.createTable('parking_ticket_logs', (table) => {
    table.id();
    table.foreignId('parking_ticket_id', 'parking_tickets');
    table.foreignId('parking_entrance_id', 'parking_entrances');
    table.foreignId('parking_spot_id', 'parking_spots');
    table.datetime('logged_datetime');
    table.varchar('action').default('PARK').notNull();
  });
}

export async function down(schema: Schema) {
  await schema.dropTable('parking_ticket_logs');
}
