import { Model, Primary, Column } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

@Model('parking_entrances')
export class ParkingEntrance {
  @Primary()
  id!: number;

  @Column()
  name!: string;
}
