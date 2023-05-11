import { Q } from "https://deno.land/x/cotton@v0.7.5/mod.ts";
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { ParkingTicket } from "../models/parking-ticket.ts";
import { ParkingTicketRepository } from "../repositories/parking-ticket.repository.ts";
import { AbstractService } from "./abstract.service.ts";
import { serviceCollection } from "./services.ts";

@Service()
export class ParkingTicketService extends AbstractService {
  constructor (
    private parkingTicketRepository: ParkingTicketRepository
  ) {
    super(parkingTicketRepository);
  }

  /**
   * Override the create method
   * 
   * @param data 
   */
  async create(data: any) {

    const parkingTicket = new ParkingTicket();
    parkingTicket.vehicle_id = data.vehicle_id;
    parkingTicket.start_datetime = data.start_datetime;
    parkingTicket.payment_status = 'UNPAID';

    return await super.create(parkingTicket);
  }

  /**
   * Determine if a parking vehicle has a pending transaction
   * If exists, get the parking ticket record
   * else, create a new parking ticket
   * 
   * @param data 
   */
   async createOrGet(data: any) {

    //get the unpaid parking ticket in case there is
    const search = await this.findOne({
      vehicle_id: data.vehicle_id,
      payment_status: Q.like('UNPAID')
    });

    //else create a new parking ticket
    if (!search) {
      return await this.create(data);
    }

    return search;
  }

  /**
   * Override the update method
   * 
   * @param id 
   * @param data 
   * @returns 
   */
   async update(id: any, data: any) {
    await this.parkingTicketRepository.update(id, data);

    return await this.parkingTicketRepository.selectOne({
      where: {id},
      includes: ['vehicle', 'parking_ticket_log']
    });
  }
}

serviceCollection.addTransient(ParkingTicketService);
