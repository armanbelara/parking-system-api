import { Model, Primary, Column, BelongsTo } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { VehicleType } from "./vehicle-type.ts";

@Model('vehicles')
export class Vehicle {
  @Primary()
  id!: number;

  @Column()
  plate_number!: string;

  @Column()
  vehicle_type_id!: number;

  @BelongsTo(() => VehicleType, 'vehicle_type_id')
  vehicle_type!: VehicleType;

}
