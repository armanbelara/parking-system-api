import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingSpotEntranceRepository } from "../repositories/parking-spot-entrance.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingSpotEntranceService extends AbstractService {
  constructor (private parkingSpotEntranceRepository: ParkingSpotEntranceRepository) {
    super(parkingSpotEntranceRepository)
  }
}

serviceCollection.addTransient(ParkingSpotEntranceService);
