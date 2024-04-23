import express from 'express'; 

import { validateBookTrip } from '../../utils/middleware';
import { BookTrip } from '../../controllers/Trip/trip';

const router = express.Router();

/**
 * @swagger
 * /api/v1/trips/booktrip:
 *   post:
 *     summary: Book a ride for trip
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Trips]
 *     description: Book a trip by providing necessary details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pickupLocation:
 *                 type: string
 *                 description: The pickup location for the trip.
 *               destination:
 *                 type: string
 *                 description: The destination for the trip.
 *             example:
 *               pickupLocation: "123 Main St"
 *               dropoffLocation: "456 Elm St"
 *     responses:
 *       200:
 *         description: The trip was successfully booked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip booked successfully"
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *       500:
 *         description: An error occurred while booking the trip.
 */
router.post('/booktrip', validateBookTrip, BookTrip);


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
 *         - dropoffLocation
 *         - status
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
 *         pickupLocation:
 *           type: string
 *           description: The pickup location for the trip.
 *         destination:
 *           type: string
 *           description: The dropoff location for the trip.
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
 *           enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled']
 *           description: The status of the trip.
 *       example:
 *         tripId: "123e4567-e89b-12d3-a456-426614174000"
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