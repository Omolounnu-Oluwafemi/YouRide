import express from 'express'; 
import { getAllTrips, getTripById } from '../../controllers/Admin/trip';
import { isAdmin } from '../../utils/middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/trips:
 *   get:
 *     summary: Retrieve a list of trips
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *       - in: query
 *         name: driverName
 *         schema:
 *           type: string
 *         description: The name of the driver
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: The name of the user
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: The status of the trip
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: The country of the trip
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the trip
 *     responses:
 *       200:
 *         description: A list of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 totalTrips:
 *                   type: integer
 *                   description: The total number of trips
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 pageSize:
 *                   type: integer
 *                   description: The number of items per page
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *       404:
 *         description: No trips found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: An error occurred while processing your request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.get('/trips', isAdmin, getAllTrips)

/**
 * @swagger
 * /api/v1/admin/trip/{tripId}:
 *   get:
 *     summary: Retrieve a trip by its ID
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trip
 *     responses:
 *       200:
 *         description: The trip data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: An error occurred while processing your request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.get('/trip/:tripId', isAdmin, getTripById)


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

export default router;