import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { serviceCollection } from "../services/services.ts";
import { VehicleService } from "../services/vehicle.services.ts";
import { ParkingTicketService } from "../services/parking-ticket.services.ts";
import { ParkingTicketLogService } from "../services/parking-ticket-log.services.ts";
import { ParkingSpotService } from "../services/parking-spot.services.ts";
import { formatDateTime } from "../helpers/date.helper.ts";

@Service()
export class ParkingController {
  constructor(
    private vehicleService: VehicleService,
    private parkingSpotService: ParkingSpotService,
    private parkingTicketService: ParkingTicketService,
    private parkingTicketLogService: ParkingTicketLogService
  ) {
  }

  /**
   * Parking a vehicle functionality
   * 
   * @param param
   */
  async parkVehicle({request, response}: RouterContext) {
    const body = await request.body().value;

    try {
      const parkingWorkflow = await this.addParkingFlow(body, 'PARK');

      response.body = {
        message: `Vehicle was parked.`,
        data: parkingWorkflow
      };
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }

  /**
   * Unpark vehicle functionality
   * 
   * @param param
   */
   async unparkVehicle({request, response}: RouterContext) {
    const body = await request.body().value;

    try {
      const parkingWorkflow = await this.addParkingFlow(body, 'UNPARK');

      //get the last parking_spot_id
      const lastParkingLog = parkingWorkflow.parking_ticket_log.at(-1);
      const parkingSpot: any = await this.parkingSpotService.findOne({
        id: lastParkingLog.parking_spot_id
      }, ['parking_type']);

      //compute the duration and total charges
      const totalHours = await this.computeParkingHours(
        body.transact_datetime,
        parkingWorkflow.start_datetime
      );
      const totalCharges = await this.computeCharges(
        totalHours, 
        {
          first_3hrs_fee: parkingSpot.parking_type.first_3hrs_fee,
          succeeding_hrs_fee: parkingSpot.parking_type.succeeding_hrs_fee,
          exceed_24hrs_fee: parkingSpot.parking_type.exceed_24hrs_fee,
        }
      );

      response.body = {
        message: `Vehicle was unparked.`,
        data: {
          ...parkingWorkflow,
          total_fee: totalCharges,
          total_hours: totalHours
        }
      };
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }

  /**
   * Compute parking fees functionality
   * 
   * @param param0 
   */
  async compute({request, response}: RouterContext) {
    const body = await request.body().value;

    try {
      //get parking ticket info
      const vehicle: any = await this.vehicleService.findOne({
        plate_number: body.plate_number
      });
      const parkingTicket: any = await this.parkingTicketService.findOne({
        vehicle_id: vehicle.id,
        payment_status: "UNPAID"
      }, ['vehicle', 'parking_ticket_log']);

      //write unpark log for the vehicle
      const parkingWorkflow = await this.addParkingFlow(body, 'UNPARK');
      
      //get the last parking_spot_id
      const lastParkingLog = parkingWorkflow.parking_ticket_log.at(-1);
      const parkingSpot: any = await this.parkingSpotService.findOne({
        id: lastParkingLog.parking_spot_id
      }, ['parking_type']);

      //compute the duration and total charges
      const totalHours = await this.computeParkingHours(
        body.transact_datetime,
        parkingTicket.start_datetime
      );
      const totalCharges = await this.computeCharges(
        totalHours, 
        {
          first_3hrs_fee: parkingSpot.parking_type.first_3hrs_fee,
          succeeding_hrs_fee: parkingSpot.parking_type.succeeding_hrs_fee,
          exceed_24hrs_fee: parkingSpot.parking_type.exceed_24hrs_fee,
        }
      );

      //update the parking ticket
      const updatedTicket = await this.parkingTicketService.update(
        parkingTicket.id, {
          total_fee: totalCharges,
          total_hours: totalHours,
          end_datetime: body.transact_datetime,
          payment_status: "PAID"
        }
      )

      response.body = {
        message: `Parking ticket paid successfully`,
        data: updatedTicket
      };
    } catch (error){
      response.status = 500;
      response.body = {
        message: `Something went wrong here. ${error}`
      }
    }
  }

  /**
   * Get the total parking hours
   * 
   * @param start 
   * @param end 
   */
  private async computeParkingHours(start: string, end: string) {
    
    const startDateTime = new Date(formatDateTime(start));
    const endDateTime = new Date(formatDateTime(end));

    const duration = await moment(startDateTime).diff(endDateTime);

    return Math.ceil(moment.duration(duration).asHours());
  }

  /**
   * Compute total charges
   * 
   * @param duration 
   * @param parking_fees 
   * @returns 
   */
  private computeCharges(duration: number, parking_fees: any) {
    let remaining = duration;
    let charges = 0;

    //compute if 24hrs exceeded
    if (remaining > 24) {
      let exceed24 = Math.floor(duration / 24);
      charges += exceed24 * parking_fees.exceed_24hrs_fee;
      remaining -= Math.floor(exceed24 * 24);
    }

    //compute the remaining after first 3 hrs
    charges += parking_fees.first_3hrs_fee
    if (remaining < 3) {
      remaining = 0;
    } else {
      remaining -= 3
    }

    //compute the hourly rate of the remaining
    if (remaining > 0) {
      charges += remaining * parking_fees.succeeding_hrs_fee
    }

    return charges;
  }

  /**
   * This will create a parking flow based on parking action
   * 
   * @param data 
   */
  private async addParkingFlow(data: any, parkingAction: string) {
    const {plate_number, parking_entrance_id, transact_datetime} = data;

    //get vehicle info
    const searchVehicle: any = await this.vehicleService.findOne({
      plate_number
    });

    //get the nearest available parking spot from entrance
    const parkingSlot: any = await this.parkingSpotService.getNearest(
      parking_entrance_id,
      searchVehicle.vehicle_type_id   //I will override the vehicle_type_id from payload
    );

    //create or get parking ticket
    const parkingTicket: any = await this.parkingTicketService.createOrGet({
      vehicle_id: searchVehicle.id,
      start_datetime: transact_datetime
    });

    //getting the parking_spot_id
    let parkingSpotId = null;
    if (parkingAction === 'UNPARK') {
      const parkingTicketLogs: any = await this.parkingTicketLogService.findAll({
        parking_ticket_id: parkingTicket.id
      });
      const lastRecord = parkingTicketLogs[parkingTicketLogs.length - 1];
      parkingSpotId = lastRecord.parking_spot_id;
    } else {
      parkingSpotId = parkingSlot[0].parking_spot_id;
    }

    //add to parking logs
    const parkingTicketLog = await this.parkingTicketLogService.create({
      parking_ticket_id: parkingTicket.id,
      parking_entrance_id: parking_entrance_id,

      parking_spot_id: parkingSpotId,

      logged_datetime: transact_datetime,
      action: parkingAction
    });

    //update parking spot availability
    const parkingSpot = await this.parkingSpotService.update(
      parkingSpotId,
      {is_occupied: parkingAction === 'PARK' ? true : false} 
    );

    const {
      id, vehicle, start_datetime, parking_ticket_log, parking_spot, payment_status, total_hours
    }: any = await this.parkingTicketService.findOne(
      {id: parkingTicket.id}, ['vehicle', 'parking_ticket_log']
    );

    //return the transaction when done
    return {
      parking_ticket_id: id, 
      vehicle, 
      start_datetime: formatDateTime(start_datetime), 
      parking_ticket_log, 
      parking_spot, 
      payment_status,
      total_hours
    }
  }
}

serviceCollection.addTransient(ParkingController);
