import { Router } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { serviceCollection } from "../services/services.ts";
import { ParkingEntranceController } from "../controllers/parking-entrance.controller.ts";
import { ParkingSpotController } from "../controllers/parking-spot.controller.ts";
import { ParkingTicketController } from "../controllers/parking-ticket.controller.ts";
import { ParkingTypeController } from "../controllers/parking-type.controller.ts";
import { ParkingController } from "../controllers/parking.controller.ts";
import { VehicleController } from "../controllers/vehicle.controller.ts";
import { ParkingMiddleware } from "../middlewares/parking.middleware.ts";
import { VehicleMiddleware } from "../middlewares/vehicle.middleware.ts";
import { VehicleValidation } from "../validations/vehicle.validation.ts";
import { ParkingSpotValidation } from "../validations/parking-spot.validation.ts";
import { ParkingFeeValidation, ParkingValidation, UnparkingValidation } from "../validations/parking.validation.ts";
import { ParkingEntranceMiddleware } from "../middlewares/parking-entrance.middleware.ts";

const router = new Router();
router.prefix('/api');

const parkingTypeController = serviceCollection.get(ParkingTypeController);
const parkingEntranceController = serviceCollection.get(ParkingEntranceController);
const parkingSpotController = serviceCollection.get(ParkingSpotController);
const parkingTicketController = serviceCollection.get(ParkingTicketController);
const parkingController = serviceCollection.get(ParkingController);
const vehicleController = serviceCollection.get(VehicleController);
const vehicleMiddleware = serviceCollection.get(VehicleMiddleware);
const parkingMiddleware = serviceCollection.get(ParkingMiddleware);
const parkingEntranceMiddleware = serviceCollection.get(ParkingEntranceMiddleware);

router
  // Parking Type
  .get('/parking-types', c => parkingTypeController.all(c))
  .get('/parking-types/:id', c => parkingTypeController.get(c))
  
  // Parking Entrance
  .get('/parking-entrances', c => parkingEntranceController.all(c))
  .get('/parking-entrances/parking-slot', c => parkingEntranceController.getAvailableParkingSlot(c))

  // Parking Spot
  .get('/parking-spots', c => parkingSpotController.all(c))
  .get('/parking-spots/entrance', c => parkingSpotController.entrance(c))
  .get('/parking-spots/:id', c => parkingSpotController.get(c))
  .post(
    '/parking-spots',
    ParkingSpotValidation,
    c => parkingSpotController.create(c)
  )

  // Vehicles
  .get('/vehicles', c => vehicleController.all(c))
  .get('/vehicles/:id', c => vehicleController.get(c))
  .post(
    '/vehicles',
    VehicleValidation, 
    (c, n) => vehicleMiddleware.isValidVehicleType(c, n),
    c => vehicleController.create(c)
  )
  .put(
    '/vehicles/:id',
    VehicleValidation, 
    (c, n) => vehicleMiddleware.isValidVehicleType(c, n),
    c => vehicleController.update(c)
  )

  // Parking Tickets
  .get('/parking-tickets', c => parkingTicketController.all(c))
  .get('/parking-tickets/:id', c => parkingTicketController.get(c))
  .post(
    '/parking-tickets',
    VehicleValidation,
    (c, n) => vehicleMiddleware.isValidVehicleType(c, n),
    (c, n) => vehicleMiddleware.create(c, n),
    ParkingValidation,
    (c, n) => parkingMiddleware.hasAvailableSlot(c, n),
    (c, n) => parkingMiddleware.isAlreadyParked(c, n),
    c => parkingTicketController.create(c)
  )

  // Park and Unpark Transaction
  .post(
    '/park-vehicle',
    VehicleValidation,
    (c, n) => vehicleMiddleware.isValidVehicleType(c, n),
    (c, n) => vehicleMiddleware.create(c, n),
    ParkingValidation,
    (c, n) => parkingEntranceMiddleware.isValidEntrance(c, n),
    (c, n) => parkingMiddleware.isAlreadyParked(c, n),
    (c, n) => parkingMiddleware.isValidTransactDate(c, n),
    (c, n) => parkingMiddleware.isExceedGracePeriod(c, n),  //
    (c, n) => parkingMiddleware.hasAvailableSlot(c, n),
    c => parkingController.parkVehicle(c)
  )
  .post(
    '/unpark-vehicle',
    UnparkingValidation,
    (c, n) => vehicleMiddleware.isExists(c, n),
    (c, n) => parkingMiddleware.isAlreadyUnparked(c, n),
    (c, n) => parkingMiddleware.isValidTransactDate(c, n),
    c => parkingController.unparkVehicle(c)
  )

  .post(
    '/compute-parking',
    ParkingFeeValidation,
    (c, n) => vehicleMiddleware.isExists(c, n),
    (c, n) => parkingMiddleware.isAlreadyUnparked(c, n),
    (c, n) => parkingMiddleware.isValidTransactDate(c, n),
    c => parkingController.compute(c)
  )
;

export default router;