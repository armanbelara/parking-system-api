import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { VehicleTypeRepository } from "../repositories/vehicle-type.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class VehicleTypeService extends AbstractService {
  constructor (private vehicleTypeRepository: VehicleTypeRepository) {
    super(vehicleTypeRepository);
  }
}

serviceCollection.addTransient(VehicleTypeService);
