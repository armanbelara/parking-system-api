import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingSpot } from "../models/parking-spot.ts";
import { ParkingSpotRepository } from "../repositories/parking-spot.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingSpotService extends AbstractService {
  constructor (private parkingSpotRepository: ParkingSpotRepository) {
    super(parkingSpotRepository)
  }

  /**
   * Override the method in getting all records
   * 
   * @param includes
   * @returns 
   */
  async all(includes: string[] = []) {
    const parking_spots: any[] = await super.all(includes);

    return parking_spots.map((parking_spot: ParkingSpot) => {
      const {parking_type_id, ...data} = parking_spot;

      return data;
    });
  }

  /**
   * Get the nearest parking spot
   * 
   * @param parking_entrance 
   * @param parking_type 
   * @param is_occupied 
   * @returns 
   */
  async getNearest(
    parking_entrance_id: any, 
    parking_type_id: any,
    is_occupied: boolean = false
  ) {

    // I hope there is a way to handle this using model
    // but for now, I'll just run an SQL query to get
    // the lowest parking distance from entrance
    return await this.parkingSpotRepository.execute(`
      SELECT * 
      FROM (
        SELECT 
          pe.id parking_entrance_id, 
          pe.name parking_entrance_name, 
          ps.id parking_spot_id,
          pt.id parking_type_id,
          pse.id parking_spot_entrance_id,
          pse.distance,
          ps.is_occupied
        FROM parking_entrances pe
        JOIN parking_spot_entrances pse ON pe.id = pse.parking_entrance_id
        JOIN parking_spots ps ON ps.id = pse.parking_spot_id
        JOIN parking_types pt ON pt.id = ps.parking_type_id
        WHERE 
          pe.id = ${parking_entrance_id} AND 
          pt.id = ${parking_type_id} AND
          ps.is_occupied = ${is_occupied}
      ) as parking_slots
      ORDER BY parking_slots.distance ASC
      LIMIT 1;
    `);
  }
}

serviceCollection.addTransient(ParkingSpotService);
