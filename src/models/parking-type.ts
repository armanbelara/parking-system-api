import { Model, Primary, Column } from "https://deno.land/x/cotton@v0.7.5/mod.ts";

@Model('parking_types')
export class ParkingType {
  @Primary()
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  first_3hrs_fee!: number;

  @Column()
  succeeding_hrs_fee!: number;

  @Column()
  exceed_24hrs_fee!: number;
}
