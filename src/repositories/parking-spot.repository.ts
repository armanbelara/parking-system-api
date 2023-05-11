import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";
import { ParkingSpot } from "../models/parking-spot.ts";

@Service()
export class ParkingSpotRepository extends AbstractRepository {
  model = ParkingSpot;
}

serviceCollection.addTransient(ParkingSpotRepository);
