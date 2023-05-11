import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { VehicleType } from "../models/vehicle-type.ts";
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";

@Service()
export class VehicleTypeRepository extends AbstractRepository {
  model = VehicleType;
}

serviceCollection.addTransient(VehicleTypeRepository);
