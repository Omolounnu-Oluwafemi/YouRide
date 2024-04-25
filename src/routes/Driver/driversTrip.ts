import express from 'express'; 
import { acceptTrip } from '../../controllers/Trip/trip';

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
 *                 error:
 *                   type: string
 *                   example: An error occurred while accepting the trip
 */
router.patch('/accept-trip', acceptTrip)

export default router