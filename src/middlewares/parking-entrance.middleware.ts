import { Service } from "https://deno.land/x/di@v0.1.1/decorators.ts";
import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { ParkingEntranceService } from "../services/parking-entrance.services.ts";
import { serviceCollection } from "../services/services.ts";

@Service()
export class ParkingEntranceMiddleware {
  constructor(
    private parkingEntranceService: ParkingEntranceService
  ) {
  }

  async isValidEntrance({request, response}: RouterContext, next: Function) {
    const {parking_entrance_id} = await request.body().value;

    const vehicle_type = await this.parkingEntranceService.findOne({id: parking_entrance_id});
  
    if (!vehicle_type) {
      response.status = 400;
      response.body = {
        parking_entrance_id: `Unknown parking entrance`
      };
      return;
    }

    await next();
  }
}

serviceCollection.addTransient(ParkingEntranceMiddleware);
