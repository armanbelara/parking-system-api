import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";
import { ParkingSpotEntrance } from "../models/parking-spot-entrance.ts";

@Service()
export class ParkingSpotEntranceRepository extends AbstractRepository {
  model = ParkingSpotEntrance;
}

serviceCollection.addTransient(ParkingSpotEntranceRepository);
