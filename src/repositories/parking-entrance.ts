import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";
import { ParkingEntrance } from "../models/parking-entrance.ts";

@Service()
export class ParkingEntranceRepository extends AbstractRepository {
  model = ParkingEntrance;
}

serviceCollection.addTransient(ParkingEntranceRepository);
