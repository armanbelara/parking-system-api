import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from "../services/services.ts";
import { VehicleService } from "../services/vehicle.services.ts";
import { ParkingTicketService } from "../services/parking-ticket.services.ts";
import { ParkingTicketLogService } from "../services/parking-ticket-log.services.ts";
import { ParkingSpotService } from "../services/parking-spot.services.ts";

@Service()
export class ParkingTicketController {
  constructor(
    private vehicleService: VehicleService,
    private parkingSpotService: ParkingSpotService,
    private parkingTicketService: ParkingTicketService,
    private parkingTicketLogService: ParkingTicketLogService
  ) {
  }

  async all({response}: RouterContext) {
    response.body = await this.parkingTicketService.all();
  }

  async get({params, response}: RouterContext) {
    response.body = await this.parkingTicketService.findOne({id: params.id}, ['parking_ticket_log']);
  }

  /**
   * Parking transaction starts here. This will create new parking ticket
   * and log the record. Default status is PARK and payment status is UNPAID
   * 
   */
  async create({request, response}: RouterContext) {
    const {plate_number, vehicle_type_id, parking_entrance_id, transact_datetime} = await request.body().value;

    try {
      const parkingSlot: any = await this.parkingSpotService.getNearest(
        parking_entrance_id,
        vehicle_type_id
      );

      //get vehicle info
      const searchVehicle: any = await this.vehicleService.findOne({
        plate_number
      });

      //create parking ticket
      const parkingTicket: any = await this.parkingTicketService.create({
        vehicle_id: searchVehicle.id,
        start_datetime: transact_datetime
      });

      //add to parking logs
      const parkingTicketLog = await this.parkingTicketLogService.create({
        parking_ticket_id: parkingTicket.id,
        parking_entrance_id: parking_entrance_id,
        parking_spot_id: parkingSlot[0].parking_spot_id,
        logged_datetime: transact_datetime,
        action: 'PARK'
      });

      //update parking spot unoccupied
      const parkingSpot = await this.parkingSpotService.update(
        parkingSlot[0].parking_spot_id, {is_occupied: true}
      );

      const {
        id, vehicle, start_datetime, parking_ticket_log, parking_spot, payment_status
      }: any = await this.parkingTicketService.findOne(
        {id: parkingTicket.id}, ['vehicle', 'parking_ticket_log']
      );

      response.body = {
        message: `Parking ticket created.`,
        data: {
          parking_ticket_id: id,
          vehicle,
          start_datetime,
          parking_ticket_log,
          parking_spot,
          payment_status
        }
      };
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }

  async update({params, request, response}: RouterContext) {
    const data = await request.body().value;

    try {
      
    } catch (error) {
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }

    //response.body = await this.vehicleService.update(params.id, data);
  }
}

serviceCollection.addTransient(ParkingTicketController);
