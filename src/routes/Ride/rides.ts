import express from 'express'; 

import { validateBookRide } from '../../utils/middleware';
import { BookRide } from '../../controllers/Ride/ride';

const router = express.Router();

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
 *               destination:
 *                 type: string
 *                 description: The destination for the ride.
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
 *         destination:
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