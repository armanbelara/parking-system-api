import { Model, Primary, Column, BelongsTo, HasMany } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { ParkingSpotEntrance } from "./parking-spot-entrance.ts";
import { ParkingType } from "./parking-type.ts";

@Model('parking_spots')
export class ParkingSpot {
  @Primary()
  id!: number;

  @Column()
  is_occupied!: boolean;

  @Column()
  parking_type_id!: number;

  @BelongsTo(() => ParkingType, 'parking_type_id')
  parking_type!: ParkingType;

  @HasMany(() => ParkingSpotEntrance, 'parking_spot_id')
  parking_spot_entrance!: ParkingSpotEntrance[];

}
