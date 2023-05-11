import { Service } from "https://deno.land/x/di@v0.1.1/decorators.ts";
import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Vehicle } from "../models/vehicle.ts";
import { serviceCollection } from "../services/services.ts";
import { VehicleTypeService } from "../services/vehicle-type.services.ts";
import { VehicleService } from "../services/vehicle.services.ts";

@Service()
export class VehicleMiddleware {
  constructor(
    private vehicleTypeService: VehicleTypeService,
    private vehicleService: VehicleService
  ) {
  }

  async isValidVehicleType({request, response}: RouterContext, next: Function) {
    const {vehicle_type_id} = await request.body().value;

    const vehicle_type = await this.vehicleTypeService.findOne({id: vehicle_type_id});
  
    if (!vehicle_type) {
      response.status = 400;
      response.body = {
        vehicle_type_id: `Unknown vehicle type`
      };
      return;
    }

    await next();
  }

  async isExists({request, response}: RouterContext, next: Function) {
    const {plate_number} = await request.body().value;

    const vehicle = await this.vehicleService.findOne({plate_number});
  
    if (!vehicle) {
      response.status = 400;
      response.body = {
        plate_number: `Unknown vehicle`
      };
      return;
    }

    await next();
  }

  async create({request, response}: RouterContext, next: Function) {
    const {plate_number, vehicle_type_id} = await request.body().value;
    try {
      const vehicle = new Vehicle();
      vehicle.plate_number = plate_number;
      vehicle.vehicle_type_id = vehicle_type_id;
      
      await this.vehicleService.createOrGet(vehicle);
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
      return;
    }

    await next();
  }
}

serviceCollection.addTransient(VehicleMiddleware);
