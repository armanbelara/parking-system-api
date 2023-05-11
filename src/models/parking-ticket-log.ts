import { Model, Primary, Column, BelongsTo } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { formatDateTime } from "../helpers/date.helper.ts";
import { ParkingEntrance } from "./parking-entrance.ts";
import { ParkingSpot } from "./parking-spot.ts";

@Model('parking_ticket_logs')
export class ParkingTicketLog {
  @Primary()
  id!: number;

  @Column()
  parking_ticket_id!: number;

  @Column()
  parking_entrance_id!: number;

  @BelongsTo(() => ParkingEntrance, 'parking_entrance_id')
  parking_entrance!: ParkingEntrance;

  @Column()
  parking_spot_id!: number;

  @BelongsTo(() => ParkingSpot, 'parking_spot_id')
  parking_spot!: ParkingSpot;

  @Column()
  action!: string;

  @Column()
  logged_datetime!: string;

  get formatted_logged_datetime(): string {
    return formatDateTime(this.logged_datetime);
  }
}
