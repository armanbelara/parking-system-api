import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { ParkingType } from "../models/parking-type.ts";
import { AbstractRepository } from "./abstract.repository.ts";

@Service()
export class ParkingTypeRepository extends AbstractRepository {
  model = ParkingType;
}

serviceCollection.addTransient(ParkingTypeRepository);
