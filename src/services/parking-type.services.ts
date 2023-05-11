import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingTypeRepository } from "../repositories/parking-type.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingTypeService extends AbstractService {
  constructor (private parkingTypeRepository: ParkingTypeRepository) {
    super(parkingTypeRepository)
  }
}

serviceCollection.addTransient(ParkingTypeService);
