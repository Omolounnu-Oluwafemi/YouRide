import express from 'express'; 

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - tripId
 *         - userId
 *         - pickupLatitude
 *         - pickupLongitude
 *         - destinationLatitude
 *         - destinationLongitude
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
 *           description: The pickup location for the trip in strings.
 *         destination:
 *           type: string
 *           description: The dropoff location for the trip in strings.
 *         pickupLatitude:
 *           type: number
 *           format: float
 *           description: The latitude of the pickup location for the trip.
 *         pickupLongitude:
 *           type: number
 *           format: float
 *           description: The longitude of the pickup location for the trip.
 *         destinationLatitude:
 *           type: number
 *           format: float
 *           description: The latitude of the dropoff location for the trip.
 *         destinationLongitude:
 *           type: number
 *           format: float
 *           description: The longitude of the dropoff location for the trip.
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
 *         pickupLatitude: 40.712776
 *         pickupLongitude: -74.005974
 *         destinationLatitude: 34.052235
 *         destinationLongitude: -118.243683
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