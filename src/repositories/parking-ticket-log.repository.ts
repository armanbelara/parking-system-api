import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";
import { ParkingTicketLog } from "../models/parking-ticket-log.ts";

@Service()
export class ParkingTicketLogRepository extends AbstractRepository {
  model = ParkingTicketLog;
}

serviceCollection.addTransient(ParkingTicketLogRepository);
