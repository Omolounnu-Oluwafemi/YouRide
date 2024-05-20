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
router.get('/trip/:tripId', isAdmin, getAllTrips)

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         tripId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the trip
 *         driverId:
 *           type: string
 *           format: uuid
 *           description: Identifier for the driver
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Identifier for the user
 *         userName:
 *           type: string
 *           description: Name of the user
 *         driverName:
 *           type: string
 *           description: Name of the driver
 *         categoryName:
 *           type: string
 *           description: Name of the vehicle category
 *         country:
 *           type: string
 *           description: Country where the trip is taking place
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Identifier for the vehicle category
 *         paymentMethod:
 *           type: string
 *           enum: ['Cash', 'Card Payment', 'Datride Wallet']
 *           description: Method of payment for the trip
 *         tripAmount:
 *           type: number
 *           description: Amount of the trip
 *         pickupLocation:
 *           type: string
 *           description: Location where the user is picked up
 *         destination:
 *           type: string
 *           description: Destination of the trip
 *         pickupLatitude:
 *           type: string
 *           description: Latitude of the pickup location
 *         pickupLongitude:
 *           type: string
 *           description: Longitude of the pickup location
 *         destinationLatitude:
 *           type: string
 *           description: Latitude of the destination
 *         destinationLongitude:
 *           type: string
 *           description: Longitude of the destination
 *         totalDistance:
 *           type: number
 *           description: Total distance of the trip
 *         pickupTime:
 *           type: string
 *           format: date-time
 *           description: Time when the user is picked up
 *         dropoffTime:
 *           type: string
 *           format: date-time
 *           description: Time when the user is dropped off
 *         status:
 *           type: string
 *           enum: ['current', 'scheduled', 'completed', 'cancelled']
 *           description: Status of the trip
 *       required:
 *         - tripId
 *         - userId
 *         - userName
 *         - categoryName
 *         - country
 *         - paymentMethod
 *         - tripAmount
 *         - pickupLocation
 *         - destination
 *         - pickupLatitude
 *         - pickupLongitude
 *         - destinationLatitude
 *         - destinationLongitude
 *         - totalDistance
 *         - status
 */

export default router;