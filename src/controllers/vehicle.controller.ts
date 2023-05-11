import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from "../services/services.ts";
import { VehicleService } from "../services/vehicle.services.ts";
import { Vehicle } from "../models/vehicle.ts";

@Service()
export class VehicleController {
  constructor(private vehicleService: VehicleService) {
  }

  async all({response}: RouterContext) {
    response.body = await this.vehicleService.all(['vehicle_type']);
  }

  async get({params, response}: RouterContext) {
    response.body = await this.vehicleService.findOne({id: params.id}, ['vehicle_type']);
  }

  async create({request, response}: RouterContext) {
    const {plate_number, vehicle_type_id} = await request.body().value;
    try {
      const vehicle = new Vehicle();
      vehicle.plate_number = plate_number;
      vehicle.vehicle_type_id = vehicle_type_id;
      
      await this.vehicleService.create(vehicle);

      response.body = {
        message: `Added vehicle ${plate_number} success`
      }
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }

  async update({params, request, response}: RouterContext) {
    try {
      const data = await request.body().value;

      response.body = await this.vehicleService.update(params.id, data);
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }
}

serviceCollection.addTransient(VehicleController);
