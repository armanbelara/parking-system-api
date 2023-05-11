import { Model, Primary, Column, BelongsTo, HasMany } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { ParkingTicketLog } from "./parking-ticket-log.ts";
import { Vehicle } from "./vehicle.ts";

@Model('parking_tickets')
export class ParkingTicket {
  @Primary()
  id!: number;

  @Column()
  vehicle_id!: number;

  @BelongsTo(() => Vehicle, 'vehicle_id')
  vehicle!: Vehicle;

  @Column()
  payment_status!: string;

  @Column()
  total_fee!: number;

  @Column()
  total_hours!: number;

  @Column()
  start_datetime!: string;

  @Column()
  end_datetime!: string;

  @HasMany(() => ParkingTicketLog, 'parking_ticket_id')
  parking_ticket_log!: ParkingTicketLog[];
}
