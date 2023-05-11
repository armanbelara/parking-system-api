import { RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { Service } from 'https://deno.land/x/di@v0.1.1/mod.ts';
import { serviceCollection } from "../services/services.ts";
import { ParkingSpotService } from "../services/parking-spot.services.ts";
import { ParkingEntranceService } from "../services/parking-entrance.services.ts";
import { ParkingSpot } from "../models/parking-spot.ts";
import { ParkingSpotEntrance } from "../models/parking-spot-entrance.ts";
import { ParkingSpotEntranceService } from "../services/parking-spot-entrance.services.ts";

@Service()
export class ParkingSpotController {
  constructor(
    private parkingSpotService: ParkingSpotService,
    private parkingEntranceService: ParkingEntranceService,
    private parkingSpotEntranceService: ParkingSpotEntranceService
  ) {
  }

  async all({response}: RouterContext) {
    const parking_spots: any[] = await this.parkingSpotService.all(['parking_type', 'parking_spot_entrance']);

    //Get raw data
    //response.body = parking_spots;

    //In case we include only the distance & parking_entrance_id
    response.body = parking_spots.map((ps: ParkingSpot) => {
      const {parking_spot_entrance, ...parking_spot} = ps;

      return {
        ...parking_spot,
        parking_spot_entrance: parking_spot_entrance.map((pse: ParkingSpotEntrance) => {
          const {parking_entrance_id, distance} = pse;
          
          return {
            parking_entrance_id,
            distance
          };
        })
      };
    });
  }

  async get({params, response}: RouterContext) {
    const parking_spot: any = await this.parkingSpotService.findOne({id: params.id}, ['parking_type', 'parking_spot_entrance']);
    const {parking_spot_entrance, parking_type_id, ...ps_data} = parking_spot;

    // deno cotton doesn't support multilevel join yet so I had
    // to explode and connect the entrance data the hard way.
    const parking_entrances_data = await this.parkingEntranceService.all();
    const parking_entrance = parking_spot_entrance.map((pse: ParkingSpotEntrance) => {
      const {parking_entrance_id, distance} = pse;
      let parking_entrance_name = '';
      parking_entrances_data.forEach((pe: any) => {
        if (pe.id === parking_entrance_id) {
          parking_entrance_name = pe.name
        }
      });

      return {
        id: parking_entrance_id,
        name: parking_entrance_name,
        distance
      };
    });

    response.body = {
      ...ps_data,
      parking_entrance
    };
  }

  async entrance({response}: RouterContext) {
    const parking_spots: any[] = await this.parkingSpotService.all(['parking_spot_entrance']);

    response.body = parking_spots.map((ps: ParkingSpot) => {
      const {parking_spot_entrance, id} = ps;

      return {
        parking_spot_id: id,
        parking_spot_entrance: parking_spot_entrance.map((pse: ParkingSpotEntrance) => {
          const {parking_entrance_id, distance} = pse;
          
          return {
            parking_entrance_id,
            distance
          };
        })
      };
    });
  }

  async create({request, response}: RouterContext) {
    // where parking_entrance_distance must be in array form [1, 3, 2]
    // and the index of the array corresponds to the parking_entrance_id
    const {parking_type_id, parking_entrance_distance} = await request.body().value;

    const parkingSpot = new ParkingSpot();
    parkingSpot.parking_type_id = parking_type_id;
    parkingSpot.is_occupied = false;

    const createdParkingSpot = await this.parkingSpotService.create(parkingSpot);

    let entranceKey = 0;
    const spotEntrances = parking_entrance_distance.map((distance: number) => {
      const parkingSpotEntrance = new ParkingSpotEntrance();
      parkingSpotEntrance.parking_spot_id = createdParkingSpot.id;
      parkingSpotEntrance.parking_entrance_id = ++entranceKey;
      parkingSpotEntrance.distance = distance;

      return parkingSpotEntrance;
    });

    await this.parkingSpotEntranceService.create(spotEntrances);

    response.body = createdParkingSpot;
  }
}

serviceCollection.addTransient(ParkingSpotController);
