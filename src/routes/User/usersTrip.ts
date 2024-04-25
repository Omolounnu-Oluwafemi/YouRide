import express from 'express'; 
import { validatetripRequest } from '../../utils/middleware';
import { calculateTripAmount, TripRequest } from '../../controllers/Trip/trip';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/trip-price:
 *   post:
 *     tags:
 *       - User-Trips
 *     summary: Calculate trip amount
 *     description: This endpoint calculates the trip amount for different vehicle types based on the provided distance, time, and optional voucher.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleName:
 *                 type: string
 *                 enum: [Datride Share, Datride Vehicle, Datride Delivery]
 *                 description: The category of the vehicle.
 *               country:
 *                 type: string
 *               totalDistance:
 *                 type: number
 *                 format: float
 *                 description: The distance of the trip in kilometers or miles.
 *               estimatedtime:
 *                 type: number
 *                 format: float
 *                 description: The time of the trip in minutes.
 *               voucher:
 *                 type: string
 *                 description: The voucher code for the trip. This is optional.
 *     responses:
 *       '200':
 *         description: Trip amounts calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trip amounts calculated successfully
 *                 tripAmounts:
 *                   type: object
 *                   properties:
 *                     Datride Vehicle:
 *                       type: number
 *                       format: float
 *                     Datride Share:
 *                       type: number
 *                       format: float
 *                     Datride Delivery:
 *                       type: number
 *                       format: float
 *       '400':
 *         description: Invalid input or Invalid or inactive voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       '404':
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle not found
 *       '500':
 *         description: An error occurred while calculating the trip amounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while calculating the trip amounts
 */
router.post('/trip-price', calculateTripAmount)

/**
 * @swagger
 * /api/v1/user/trip-request:
 *   post:
 *     tags:
 *       - User-Trips
 *     summary: Create a new trip
 *     description: This endpoint allows for the creation of a new trip.
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
 *               vehicleName:
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
 *       '400':
 *         description: Invalid trip option
 *       '404':
 *         description: User not found or no available drivers found
 *       '500':
 *         description: An error occurred while processing your request
 */
router.post('/trip-request', validatetripRequest, TripRequest)

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

export default router;