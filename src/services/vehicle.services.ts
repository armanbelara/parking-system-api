import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { Vehicle } from "../models/vehicle.ts";
import { VehicleRepository } from "../repositories/vehicle.repositories.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class VehicleService extends AbstractService {
  constructor (private vehicleRepository: VehicleRepository) {
    super(vehicleRepository);
  }

  /**
   * Determine if a vehicle is already existing or not
   * If not exists, create a new vehicle
   * else, return the vehicle record
   * 
   * @param data
   * @returns 
   */
   async createOrGet(data: any) {
     
    const search = await this.findOne({
      plate_number: data.plate_number
    });

    if (!search) {
      const vehicle = new Vehicle();
      vehicle.id = data.id || null;
      vehicle.plate_number = data.plate_number || null;
      vehicle.vehicle_type_id = data.vehicle_type_id || null; 

      return await this.create(vehicle);
    }

    return search;
  }
}

serviceCollection.addTransient(VehicleService);
