import express from 'express';
import { getVehicleDetails, updateAvailability, updateVehicleDetails } from '../../controllers/Driver/dashboard';

const router = express.Router();

/**
 * @swagger
 * /api/v1/driver/dashboard/vehicle:
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

/**
 * @swagger
 * /api/v1/driver/dashboard/vehicle-updates:
 *   patch:
 *     summary: Update vehicle details
 *     tags: [Drivers]
 *     description: Update details of a vehicle by the driver's ID from the JWT token stored in a cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Private Driver, Taxi Driver, Delivery Driver]
 *               vehicleYear:
 *                 type: string
 *                 enum: ['2024', '2023', '2022', '2021', '2020', '2019', '2018']
 *               vehicleManufacturer:
 *                 enum: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet']
 *               vehicleColor:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle details updated successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: An error occurred while updating vehicle details
 */
router.patch('/vehicle-updates', updateVehicleDetails)

/**
 * @swagger
 * /api/v1/driver/dashboard/availability:
 *   patch:
 *     summary: Update driver availability
 *     tags: [Drivers]
 *     description: Update the availability of a driver by the driver's ID from the JWT token stored in a cookie.
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: An error occurred while updating availability
 */
router.patch('/availability', updateAvailability)

export default router;
