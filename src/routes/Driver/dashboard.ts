import express from 'express';
import { getVehicleDetails, updateAvailability, updateVehicleDetails, driverRating, getDriverRideHistory, getDriverById } from '../../controllers/Driver/dashboard';
import { checkInternetConnectionMiddleware, validateDriverRating } from '../../utils/middleware';

const router = express.Router();

router.use(checkInternetConnectionMiddleware);

/**
 * @swagger
 * /api/v1/driver/dashboard/vehicle:
 *   get:
 *     summary: Retrieve vehicle details
 *     tags: [Driver Account]
 *     description: Retrieve details of a vehicle by the driver's ID from the JWT token stored in a cookie.
 *     responses:
 *       200:
 *         description: A JSON object of vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                     vehicleYear:
 *                       type: integer
 *                     vehicleManufacturer:
 *                       type: string
 *                     vehicleColor:
 *                       type: string
 *                     licensePlate:
 *                       type: string
 *                     vehicleNumber:
 *                       type: string
 *                     driverLicense:
 *                       type: string
 *                     vehicleLogBook:
 *                       type: string
 *                     privateHireLicenseBadge:
 *                       type: string
 *                     insuranceCertificate:
 *                       type: string
 *                     motTestCertificate:
 *                       type: string
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while retrieving vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: An error occurred while retrieving vehicle details
 */
router.get('/vehicle', getVehicleDetails);

/**
 * @swagger
 * /api/v1/driver/dashboard/vehicle-updates:
 *   patch:
 *     summary: Update vehicle details
 *     tags: [Driver Account]
 *     description: Update details of a vehicle by the driver's ID from the JWT token stored in a cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Private Driver, Taxi Driver, Delivery Driver]
 *               vehicleYear:
 *                 type: string
 *                 enum: ['2024', '2023', '2022', '2021', '2020', '2019', '2018']
 *               vehicleManufacturer:
 *                 type: string
 *                 enum: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet']
 *               vehicleColor:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Vehicle details updated successfully
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while updating vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: An error occurred while updating vehicle details
 */
router.patch('/vehicle-updates', updateVehicleDetails);

/**
 * @swagger
 * /api/v1/driver/dashboard/availability:
 *   patch:
 *     summary: Update driver availability and location
 *     tags: [Driver Account]
 *     description: Update the availability and location of a driver by the driver's ID from the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *               longitude:
 *                 type: number
 *                 format: float
 *               driverId:
 *                 type: string
 *                 description: The ID of the driver
 *               socketId:
 *                 type: string
 *                 description: The socket ID of the driver
 *     responses:
 *       200:
 *         description: Availability and location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Availability and location updated successfully
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while updating availability and location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: An error occurred while updating availability and location
 */
router.patch('/availability', updateAvailability);

/**
 * @swagger
 * /api/v1/driver/dashboard/rating:
 *   patch:
 *     summary: Rate a Driver
 *     tags: [Driver Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The driver ID
 *               rating:
 *                 type: integer
 *                 description: The rating to give the Driver
 *     responses:
 *       200:
 *         description: The Driver was successfully rated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The status code
 *                 message:
 *                   type: string
 *                   description: The status message
 *                 newAverageRating:
 *                   type: number
 *                   description: The new average rating of the Driver
 *       404:
 *         description: The Driver was not found
 *       500:
 *         description: There was an error rating the Driver
 */
router.patch('/rating',validateDriverRating,  driverRating);

/**
 * @swagger
 * /api/v1/driver/dashboard/ridehistory:
 *   get:
 *     summary: Retrieve a list of rides by driver
 *     tags: [Driver Account]
 *     description: Retrieve a list of rides that belong to a specific driver.
 *     parameters:
 *       - in: query
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of rides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 rideHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 totalTrips:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: No trips found for this driver or driver not found
 *       500:
 *         description: An error occurred while processing your request
 */
router.get('/ridehistory', getDriverRideHistory);

/**
 * @swagger
 * /api/v1/driver/getonedriver/{driverId}:
 *   get:
 *     summary: Retrieve a Driver by their unique driverId
 *     tags: [Driver Account]
 *     description: This endpoint retrieves driver's details using their unique identifier (driverId).
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the driver
 *     responses:
 *       200:
 *         description: Driver retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 Driver:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Driver ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Driver ID is required
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while retrieving driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: An error occurred while retrieving driver
 */
router.get('/getonedriver/:driverId', getDriverById);


/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - tripId
 *         - userId
 *         - pickupLocation
 *         - destination
 *         - status
 *         - vehicleName
 *         - country
 *         - paymentMethod
 *         - tripAmount
 *         - pickupLatitude
 *         - pickupLongitude
 *         - destinationLatitude
 *         - destinationLongitude
 *         - totalDistance
 *       properties:
 *         tripId:
 *           type: string
 *           format: uuid
 *           description: The ID of the trip.
 *         driverId:
 *           type: string
 *           format: uuid
 *           description: The ID of the driver for the trip.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who booked the trip.
 *         userName:
 *           type: string
 *           description: The name of the user who booked the trip.
 *         driverName:
 *           type: string
 *           description: The name of the driver for the trip.
 *         vehicleName:
 *           type: string
 *           description: The name of the vehicle for the trip.
 *         country:
 *           type: string
 *           description: The country where the trip is taking place.
 *         vehicleId:
 *           type: string
 *           format: uuid
 *           description: The ID of the vehicle for the trip.
 *         paymentMethod:
 *           type: string
 *           enum: ['Cash', 'Card Payment', 'Datride Wallet']
 *           description: The payment method for the trip.
 *         tripAmount:
 *           type: number
 *           description: The amount of the trip.
 *         pickupLocation:
 *           type: string
 *           description: The pickup location for the trip.
 *         destination:
 *           type: string
 *           description: The dropoff location for the trip.
 *         pickupLatitude:
 *           type: number
 *           description: The latitude of the pickup location for the trip.
 *         pickupLongitude:
 *           type: number
 *           description: The longitude of the pickup location for the trip.
 *         destinationLatitude:
 *           type: number
 *           description: The latitude of the destination for the trip.
 *         destinationLongitude:
 *           type: number
 *           description: The longitude of the destination for the trip.
 *         totalDistance:
 *           type: number
 *           description: The total distance of the trip.
 *         pickupTime:
 *           type: string
 *           format: date-time
 *           description: The pickup time for the trip.
 *         dropoffTime:
 *           type: string
 *           format: date-time
 *           description: The dropoff time for the trip.
 *         status:
 *           type: string
 *           enum: ['current', 'scheduled', 'completed' , 'cancelled']
 *           description: The status of the trip.
 *       example:
 *         tripId: "123e4567-e89b-12d3-a456-426614174000"
 *         driverId: "123e4567-e89b-12d3-a456-426614174000"
 *         userId: "123e4567-e89b-12d3-a456-426614174000"
 *         userName: "John Doe"
 *         driverName: "Jane Doe"
 *         vehicleName: "Toyota Camry"
 *         country: "USA"
 *         vehicleId: "123e4567-e89b-12d3-a456-426614174000"
 *         paymentMethod: "Card Payment"
 *         tripAmount: 50
 *         pickupLocation: "123 Main St"
 *         destination: "456 Elm St"
 *         pickupLatitude: 40.712776
 *         pickupLongitude: -74.005974
 *         destinationLatitude: 40.712776
 *         destinationLongitude: -74.005974
 *         totalDistance: 10
 *         pickupTime: "2022-01-01T00:00:00Z"
 *         dropoffTime: "2022-01-01T01:00:00Z"
 *         status: "scheduled"
 */
export default router;
