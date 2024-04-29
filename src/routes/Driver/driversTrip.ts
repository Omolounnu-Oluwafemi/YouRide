import express from 'express'; 
import { acceptTrip, cancelTrip, completeTrip, skipTrip, startTrip } from '../../controllers/Trip/trip';

const router = express.Router();

/**
 * @swagger
 * /api/v1/driver/accept-trip:
 *   patch:
 *     summary: Accept a trip
 *     tags:
 *       - Driver-Trips
 *     description: This endpoint allows a driver to accept a trip.
 *     operationId: acceptTrip
 *     requestBody:
 *       description: Trip ID to accept
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: The ID of the trip to accept.
 *     responses:
 *       '200':
 *         description: Trip accepted successfully
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
 *                   example: Trip accepted successfully
 *                 trip:
 *                   type: object
 *                   properties:
 *                     tripId:
 *                       type: string
 *                     driverId:
 *                       type: string
 *                     driverName:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [accepted]
 *       '400':
 *         description: Trip is already accepted by another driver
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
 *                   example: Trip is already accepted by another driver
 *       '404':
 *         description: Trip or driver not found
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
 *                   example: Trip not found
 *       '500':
 *         description: An error occurred while accepting the trip
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
 *                   example: An error occurred while accepting the trip
 */
router.patch('/accept-trip', acceptTrip)

/**
 * @swagger
 * /api/v1/driver/skip-trip/{tripId}:
 *   patch:
 *     summary: Skip a trip
 *     tags:
 *       - Driver-Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The id of the trip to skip
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The trip was successfully skipped
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
 *                 nextDriver:
 *                   type: object
 *                   properties:
 *                     driverId:
 *                       type: string
 *                     driverName:
 *                       type: string
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
 *                 error:
 *                   type: string
 *                   example: Trip not found
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
 *                 error:
 *                   type: string
 *                   example: An error occurred while skipping the trip
 */
router.patch('/skip-trip/:tripId', skipTrip);

/**
 * @swagger
 * /api/v1/driver/start-trip/{tripId}:
 *   patch:
 *     summary: Start a trip
 *     tags:
 *       - Driver-Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The id of the trip to start
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - pickupTime
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: The id of the driver
 *               pickupTime:
 *                 type: string
 *                 format: date-time
 *                 description: The pickup time for the trip
 *     responses:
 *       200:
 *         description: The trip was successfully started
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
 *       403:
 *         description: Forbidden, the trip is not assigned to the current driver
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
 *                   example: Forbidden, the trip is not assigned to the current driver
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
 *                 error:
 *                   type: string
 *                   example: Trip not found
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
 *                 error:
 *                   type: string
 *                   example: An error occurred while starting the trip
 */
router.patch('/start-trip/:tripId', startTrip);

/**
 * @swagger
 * /api/v1/driver/cancel-trip/{tripId}:
 *   patch:
 *     summary: Cancel a trip
 *     tags:
 *       - Driver-Trips
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
 *                 error:
 *                   type: string
 *                   example: Trip not found
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
 *                 error:
 *                   type: string
 *                   example: An error occurred while cancelling the trip
 */
router.patch('/cancel-trip/:tripId', cancelTrip);

/**
 * @swagger
 * /api/v1/driver/complete-trip/{tripId}:
 *   patch:
 *     summary: Complete a trip
 *     tags:
 *       - Driver-Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         description: The id of the trip to complete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The trip was successfully completed
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
 *                 error:
 *                   type: string
 *                   example: Trip not found
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
 *                 error:
 *                   type: string
 *                   example: An error occurred while completing the trip
 */
router.patch('/complete-trip/:tripId', completeTrip);

export default router