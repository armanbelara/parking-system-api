import { Service } from "https://deno.land/x/di@v0.1.1/decorators.ts";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { formatDateTime } from "../helpers/date.helper.ts";
import { ParkingSpotService } from "../services/parking-spot.services.ts";
import { ParkingTicketService } from "../services/parking-ticket.services.ts";
import { serviceCollection } from "../services/services.ts";
import { VehicleService } from "../services/vehicle.services.ts";

@Service()
export class ParkingMiddleware {
  constructor(
    private parkingSpotService: ParkingSpotService,
    private parkingTicketService: ParkingTicketService,
    private vehicleService: VehicleService
  ) {
  }

  /**
   * 
   * @param param0 
   * @param next 
   * @returns 
   */
  async hasAvailableSlot({request, response}: RouterContext, next: Function) {
    const {parking_entrance_id, vehicle_type_id} = await request.body().value;
    
    const parkingSlot: any = await this.parkingSpotService.getNearest(
      parking_entrance_id, vehicle_type_id
    );

    if (parkingSlot.length === 0) {
      response.status = 400;
      response.body = {
        parking_spot: `Unavailable Parking Spot`
      };
      return;
    }

    await next();
  }

  /**
   * 
   * @param param
   * @param next 
   * @returns 
   */
  async isAlreadyParked({request, response}: RouterContext, next: Function) {
    const body = await request.body().value;

    const hasTheSameParkingStatus = await this.checkParkingStatus(body, "PARK");
    if (hasTheSameParkingStatus) {
      response.status = 400;
      response.body = {
        message: `Already parked`
      };
      return;
    }

    await next();
  }

  /**
   * 
   * @param param
   * @param next 
   * @returns 
   */
  async isAlreadyUnparked({request, response}: RouterContext, next: Function) {
    const body = await request.body().value;

    const hasTheSameParkingStatus = await this.checkParkingStatus(body, "UNPARK");
    if (hasTheSameParkingStatus) {
      response.status = 400;
      response.body = {
        message: `Already unparked`
      };
      return;
    }

    await next();
  }

  /**
   * Check if the transaction datetime is less than the last logged datetime
   * 
   * @param param0 
   * @param next 
   * @returns 
   */
  async isValidTransactDate({request, response}: RouterContext, next: Function) {
    const {plate_number, transact_datetime} = await request.body().value;

    const vehicle: any = await this.vehicleService.findOne({plate_number});
    const parkingTicket: any = await this.parkingTicketService.findOne({
      vehicle_id: vehicle.id,
      payment_status: "UNPAID"
    }, ['parking_ticket_log']);

    if (parkingTicket) {
      const parkingTicketLogs = parkingTicket.parking_ticket_log;
      const lastRecord = parkingTicketLogs.at(-1);
      const lastLogDateTime = new Date(formatDateTime(lastRecord.logged_datetime));
      const transactDateTime = new Date(formatDateTime(transact_datetime));
      const duration = await moment(transactDateTime).diff(lastLogDateTime);
      console.log(duration);

      // check if the transaction date time is too early
      const durationInMilliseconds = await moment.duration(duration).asMilliseconds();
      if (durationInMilliseconds < 0) {
        response.status = 400;
        response.body = {
          message: `Invalid transact date. You parked or unparked too early from your previous parking log.`,
          data: {
            transact_datetime: formatDateTime(transact_datetime),
            last_logged_datetime: formatDateTime(lastRecord.logged_datetime)
          }
        };
        return;
      }
    }

    await next();
  }

  /**
   * Check if the transaction is parking and the duration is
   * more than 1 hour, return invalid parking
   * 
   * @param param0 
   * @param parkingAction 
   * @returns 
   */
  async isExceedGracePeriod({request, response}: RouterContext, next: Function) {
    const {plate_number, transact_datetime} = await request.body().value;

    const vehicle: any = await this.vehicleService.findOne({plate_number});
    const parkingTicket: any = await this.parkingTicketService.findOne({
      vehicle_id: vehicle.id,
      payment_status: "UNPAID"
    }, ['parking_ticket_log']);

    if (parkingTicket) {
      const parkingTicketLogs = parkingTicket.parking_ticket_log;
      const lastRecord = parkingTicketLogs[parkingTicketLogs.length - 1];
      const lastLogDateTime = new Date(formatDateTime(lastRecord.logged_datetime));
      const transactDateTime = new Date(formatDateTime(transact_datetime));
      const duration = await moment(transactDateTime).diff(lastLogDateTime);
      console.log(duration);

      const durationInHours = await moment.duration(duration).asHours();
      if (request.url.pathname.includes('/park-vehicle') && durationInHours > 1) {
        response.status = 400;
        response.body = {
          message: `Exceeds 1 hour grace period. Please pay your previous parking ticket first.`,
          data: {
            parking_ticket_id: parkingTicket.id,
            last_logged_datetime: lastRecord.formatted_logged_datetime
          }
        };
        return;
      }
    }

    await next();
  }

  /**
   * Check if the last parking log is the same with the current parking action
   * 
   * @param body 
   * @param parkingAction 
   * @returns 
   */
  private async checkParkingStatus(body: any, parkingAction: string){
    const {plate_number} = body;

    const vehicle: any = await this.vehicleService.findOne({plate_number});
    const parkingTicket: any = await this.parkingTicketService.findOne({
      vehicle_id: vehicle.id,
      payment_status: "UNPAID"
    }, ['parking_ticket_log']);
    let hasTheSameParkingStatus = false;

    if (parkingTicket && parkingTicket.parking_ticket_log.length > 0) {
      const parkingTicketLogs = parkingTicket.parking_ticket_log;
      const lastRecord: any = parkingTicketLogs[parkingTicketLogs.length - 1];
      
      if (lastRecord.action === parkingAction) {
        hasTheSameParkingStatus = true;
      }
    }

    return hasTheSameParkingStatus;
  }
}

serviceCollection.addTransient(ParkingMiddleware);
