import express from 'express'; 
const router = express.Router();
import { CreateRideOption, GetRideOptions, UpdateRideOption } from '../../controllers/Ride/rideOptions';
import { isAdmin, validateBookRide, validateCreateRideOption, validateUpdateRideOption } from '../../utils/middleware';
import { BookRide } from '../../controllers/Ride/ride';

/**
 * @swagger
 * /api/v1/rides/options:
 *   get:
 *     summary: Retrieve a list of ride options
 *     tags: [Rides]
 *     description: Retrieve a list of ride options. This can be used to populate a list of available ride options for a user to choose from.
 *     responses:
 *       200:
 *         description: A list of ride options.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicleType:
 *                     type: string
 *                     description: The type of vehicle for the ride option.
 *                   capacity:
 *                     type: integer
 *                     description: The capacity of the vehicle for the ride option.
 *                   pricing:
 *                     type: number
 *                     description: The pricing for the ride option.
 *                   serviceType:
 *                     type: string
 *                     description: The service type of the ride option.
 *       404:
 *         description: No ride options found.
 *       500:
 *         description: An error occurred while fetching ride options.
 */
router.get('/options', GetRideOptions);

/**
 * @swagger
 * /api/v1/rides/options:
 *   post:
 *     summary: Create a ride option
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Rides]
 *     description: Create a new ride option. Only accessible by admins.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pricing:
 *                 type: number
 *                 format: float
 *                 description: The pricing for the ride option.
 *               serviceType:
 *                 type: string
 *                 enum: ['Datride Vehicle', 'Datride Share', 'Datride Delivery']
 *                 description: The service type for the ride option.
 *             example:
 *               pricing: 15.99
 *               serviceType: "Datride Vehicle"
 *     responses:
 *       200:
 *         description: The ride option was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ride option created successfully"
 *                 rideOption:
 *                   $ref: '#/components/schemas/RideOption'
 *       500:
 *         description: An error occurred while creating the ride option.
 */
router.post('/options', isAdmin, validateCreateRideOption, CreateRideOption);

/**
 * @swagger
 * /api/v1/rides/bookride:
 *   post:
 *     summary: Book a ride
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Rides]
 *     description: Book a ride by providing necessary details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pickupLocation:
 *                 type: string
 *                 description: The pickup location for the ride.
 *               dropoffLocation:
 *                 type: string
 *                 description: The dropoff location for the ride.
 *             example:
 *               pickupLocation: "123 Main St"
 *               dropoffLocation: "456 Elm St"
 *     responses:
 *       200:
 *         description: The ride was successfully booked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ride booked successfully"
 *                 ride:
 *                   $ref: '#/components/schemas/Ride'
 *       500:
 *         description: An error occurred while booking the ride.
 */
router.post('/bookride', validateBookRide, BookRide);

/**
 * @swagger
 * /api/v1/rides/update-options:
 *   put:
 *     summary: Update a ride options
 *     tags: [Rides]
 *     description: Only an admin user can update the ride options
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rideOptionid:
 *                 type: string
 *                 description: The ID of the ride option to update
 *               pricing:
 *                 type: number
 *                 description: The pricing for the ride option.
 *               serviceType:
 *                 type: string
 *                 description: The service type of the ride option.
 *           required: true
 *     responses:
 *       200:
 *         description: Ride options updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rideOption:
 *                   type: object
 *                   properties:
 *                     rideOptionId:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *                     pricing:
 *                       type: number
 *                     serviceType:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       404:
 *         description: No ride options found.
 *       500:
 *         description: An error occurred while updating ride options.
 */
router.put('/update-options', isAdmin, validateUpdateRideOption, UpdateRideOption);

/**
 * @swagger
 * components:
 *   schemas:
 *     RideOption:
 *       type: object
 *       required:
 *         - vehicleType
 *         - capacity
 *         - pricing
 *         - serviceType
 *       properties:
 *         vehicleType:
 *           type: string
 *           description: The type of vehicle for the ride option.
 *         capacity:
 *           type: integer
 *           description: The capacity of the vehicle for the ride option.
 *         pricing:
 *           type: number
 *           description: The pricing for the ride option.
 *         serviceType:
 *           type: string
 *           description: The service type of the ride option.
 *       example:
 *         vehicleType: "Car"
 *         capacity: 4
 *         pricing: 10.5
 *         serviceType: "Standard"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - rideId
 *         - userId
 *         - pickupLocation
 *         - dropoffLocation
 *         - status
 *       properties:
 *         rideId:
 *           type: string
 *           format: uuid
 *           description: The ID of the ride.
 *         driverId:
 *           type: string
 *           format: uuid
 *           description: The ID of the driver for the ride.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who booked the ride.
 *         pickupLocation:
 *           type: string
 *           description: The pickup location for the ride.
 *         dropoffLocation:
 *           type: string
 *           description: The dropoff location for the ride.
 *         pickupTime:
 *           type: string
 *           format: date-time
 *           description: The pickup time for the ride.
 *         dropoffTime:
 *           type: string
 *           format: date-time
 *           description: The dropoff time for the ride.
 *         status:
 *           type: string
 *           enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled']
 *           description: The status of the ride.
 *       example:
 *         rideId: "123e4567-e89b-12d3-a456-426614174000"
 *         driverId: "123e4567-e89b-12d3-a456-426614174000"
 *         userId: "123e4567-e89b-12d3-a456-426614174000"
 *         pickupLocation: "123 Main St"
 *         dropoffLocation: "456 Elm St"
 *         pickupTime: "2022-01-01T00:00:00Z"
 *         dropoffTime: "2022-01-01T01:00:00Z"
 *         status: "pending"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:        
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  
 * security:
 *   - BearerAuth: []
 */
export default router;