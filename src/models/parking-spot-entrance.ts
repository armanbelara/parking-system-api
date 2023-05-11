import { Model, Primary, Column, BelongsTo } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { ParkingEntrance } from "./parking-entrance.ts";

@Model('parking_spot_entrances')
export class ParkingSpotEntrance {
  @Primary()
  id!: number;

  @Column()
  parking_spot_id!: number;

  @Column()
  distance!: number;

  @Column()
  parking_entrance_id!: number;

  @BelongsTo(() => ParkingEntrance, 'parking_entrance_id')
  parking_entrance!: ParkingEntrance;
}
