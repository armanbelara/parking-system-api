import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingTicketLog } from "../models/parking-ticket-log.ts";
import { ParkingTicketLogRepository } from "../repositories/parking-ticket-log.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingTicketLogService extends AbstractService {
  constructor (private parkingTicketLogRepository: ParkingTicketLogRepository) {
    super(parkingTicketLogRepository);
  }

  /**
   * Override the create method
   * 
   * @param data 
   */
   async create(data: any) {
    const parkingTicketLog = new ParkingTicketLog();
    parkingTicketLog.parking_ticket_id = data.parking_ticket_id;
    parkingTicketLog.parking_entrance_id = data.parking_entrance_id;
    parkingTicketLog.parking_spot_id = data.parking_spot_id;
    parkingTicketLog.logged_datetime = data.logged_datetime;
    parkingTicketLog.action = data.action;

    return await super.create(parkingTicketLog);
  }
}

serviceCollection.addTransient(ParkingTicketLogService);
