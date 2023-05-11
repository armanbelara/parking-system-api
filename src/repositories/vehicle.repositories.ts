import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { Vehicle } from "../models/vehicle.ts";
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";

@Service()
export class VehicleRepository extends AbstractRepository {
  model = Vehicle;
}

serviceCollection.addTransient(VehicleRepository);
