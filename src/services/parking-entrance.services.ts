import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingEntranceRepository } from "../repositories/parking-entrance.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingEntranceService extends AbstractService {
  constructor (private parkingEntranceRepository: ParkingEntranceRepository) {
    super(parkingEntranceRepository)
  }
}

serviceCollection.addTransient(ParkingEntranceService);
