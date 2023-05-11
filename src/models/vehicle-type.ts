import { Model, Primary, Column } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

@Model('vehicle_types')
export class VehicleType {
  @Primary()
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;
}
