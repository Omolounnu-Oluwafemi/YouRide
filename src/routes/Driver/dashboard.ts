import express from 'express';
import { getVehicleDetails } from '../../controllers/Driver/dashboard';

const router = express.Router();

/**
 * @swagger
 * /driver/dashboard/vehicle:
 *   get:
 *     summary: Retrieve vehicle details
 *     tags: [Drivers]
 *     description: Retrieve details of a vehicle by the driver's ID from the JWT token stored in a cookie.
 *     responses:
 *       200:
 *         description: A JSON object of vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 vehicleYear:
 *                   type: integer
 *                 vehicleManufacturer:
 *                   type: string
 *                 vehicleColor:
 *                   type: string
 *                 licensePlate:
 *                   type: string
 *                 vehicleNumber:
 *                   type: string
 *                 driverLicense:
 *                   type: string
 *                 vehicleLogBook:
 *                   type: string
 *                 privateHireLicenseBadge:
 *                   type: string
 *                 insuranceCertificate:
 *                   type: string
 *                 motTestCertificate:
 *                   type: string
 *       404:
 *         description: Driver not found
 *       500:
 *         description: An error occurred while retrieving vehicle details
 */
router.get('/vehicle', getVehicleDetails);

export default router;