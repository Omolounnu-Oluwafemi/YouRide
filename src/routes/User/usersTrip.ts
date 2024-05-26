import express from 'express'; 
import { validatetripRequest } from '../../utils/middleware';
import { cancelTrip } from '../../controllers/Trip/trip';
import { GetAvailableRides, requestRide, } from '../../controllers/Trip/trip';
import { getUserTrips } from '../../controllers/User/usersInfo';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/request/{userId}:
 *   post:
 *     summary: Request a Trip
 *     tags:
 *       - User-Trips
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               pickupLocation:
 *                 type: string
 *               destination:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               tripAmount:
 *                 type: number
 *               totalDistance:
 *                 type: number
 *               pickupLatitude:
 *                 type: number
 *               pickupLongitude:
 *                 type: number
 *               destinationLatitude:
 *                 type: number
 *               destinationLongitude:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Trip order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 Success:
 *                   type: string
 *                 data:
 *                   type: object
 *       '404':
 *         description: User not found or No available rides found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 error:
 *                   type: string
 *       '500':
 *         description: An error occurred while processing your request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/request/:userId', validatetripRequest, requestRide);

/**
 * @swagger
 * /api/v1/user/cancel-trip/{tripId}:
 *   patch:
 *     summary: Cancel a trip
 *     tags:
 *       - User-Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The id of the trip to cancel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The trip was successfully cancelled
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
 *                   example: The trip was successfully cancelled
 *       404:
 *         description: Not found, the trip with the given id was not found
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
 *                   example: Not found, the trip with the given id was not found
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error
 */
router.patch('/cancel-trip/:tripId', cancelTrip);

/**
 * @swagger
 * /api/v1/user/availablerides:
 *   get:
 *     summary: Get all available rides for a user
 *     tags: [User-Trips]
 *     description: Fetch all available rides based on the user's location and destination. 
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *       - in: query
 *         name: pickupLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The pickup latitude
 *       - in: query
 *         name: pickupLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The pickup longitude
 *       - in: query
 *         name: destinationLatitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The destination latitude
 *       - in: query
 *         name: destinationLongitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The destination longitude
 *       - in: query
 *         name: voucher
 *         required: false
 *         schema:
 *           type: string
 *         description: The voucher code
 *     responses:
 *       200:
 *         description: A list of available rides for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: The success message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The vehicle category ID
 *                       categoryName:
 *                         type: string
 *                         description: The category of the vehicle
 *                       Drivers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: The driver's ID
 *                             name:
 *                               type: string
 *                               description: The driver's name
 *                             latitude:
 *                               type: string
 *                               description: The driver's latitude
 *                             longitude:
 *                               type: string
 *                               description: The driver's longitude
 *                       tripAmount:
 *                         type: number
 *                         description: The estimated trip amount
 *                       driverCount:
 *                         type: number
 *                         description: The number of available drivers
 *                       closestDriverId:
 *                         type: string
 *                         description: The ID of the closest driver
 *                       estimatedPickupTime:
 *                         type: string
 *                         description: The estimated pickup time
 *       400:
 *         description: Invalid user ID or voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid user ID
 *       404:
 *         description: User not found or no available rides found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: An error occurred while processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: An error occurred while processing your request
 */
router.get('/availablerides', GetAvailableRides);

/**
 * @swagger
 * /api/v1/user/{userId}/getusertrips:
 *   get:
 *     summary: Retrieve a list of trips by user
 *     tags: [User-Trips]
 *     description: Retrieve a list of trips that belong to a specific user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of trips.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       404:
 *         description: No trips found for this user
 *       500:
 *         description: An error occurred while processing your request
 */
router.get('/:userId/getusertrips', getUserTrips)

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