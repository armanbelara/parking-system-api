import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from '../services/services.ts';
import { AbstractRepository } from "./abstract.repository.ts";
import { ParkingTicket } from "../models/parking-ticket.ts";

@Service()
export class ParkingTicketRepository extends AbstractRepository {
  model = ParkingTicket;
}

serviceCollection.addTransient(ParkingTicketRepository);
