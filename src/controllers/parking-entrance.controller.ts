import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from "../services/services.ts";
import { ParkingEntranceService } from "../services/parking-entrance.services.ts";
import { ParkingSpotService } from "../services/parking-spot.services.ts";

@Service()
export class ParkingEntranceController {
  constructor(
    private parkingEntranceService: ParkingEntranceService,
    private parkingSpotService: ParkingSpotService
  ) {
  }

  async all({response}: RouterContext) {
    response.body = await this.parkingEntranceService.all();
  }

  async getAvailableParkingSlot({request, response}: RouterContext) {
    const entrance = request.url.searchParams.get('entrance');
    const parking_type = request.url.searchParams.get('parking-type');

    const parking_slots = await this.parkingSpotService.getNearest(
      entrance,
      parking_type
    );

    response.body = parking_slots[0];
  }
}

serviceCollection.addTransient(ParkingEntranceController);
