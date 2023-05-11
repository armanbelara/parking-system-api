import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingTypeService } from "../services/parking-type.services.ts";
import { serviceCollection } from "../services/services.ts";

@Service()
export class ParkingTypeController {
  constructor(private parkingTypeService: ParkingTypeService) {
  }

  async all({response}: RouterContext) {
    response.body = await this.parkingTypeService.all();
  }

  async get({params, response}: RouterContext) {
    response.body = await this.parkingTypeService.findOne({id: params.id});
  }
}

serviceCollection.addTransient(ParkingTypeController);
