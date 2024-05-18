import express from 'express';
import { getVehicleDetails, updateAvailability, updateVehicleDetails, driverRating } from '../../controllers/Driver/dashboard';
import { checkInternetConnectionMiddleware, validateDriverRating } from '../../utils/middleware';

const router = express.Router();

router.use(checkInternetConnectionMiddleware);

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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                     vehicleYear:
 *                       type: integer
 *                     vehicleManufacturer:
 *                       type: string
 *                     vehicleColor:
 *                       type: string
 *                     licensePlate:
 *                       type: string
 *                     vehicleNumber:
 *                       type: string
 *                     driverLicense:
 *                       type: string
 *                     vehicleLogBook:
 *                       type: string
 *                     privateHireLicenseBadge:
 *                       type: string
 *                     insuranceCertificate:
 *                       type: string
 *                     motTestCertificate:
 *                       type: string
 *       404:
 *         description: Driver not found
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
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while retrieving vehicle details
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
 *                   description: An error occurred while retrieving vehicle details
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
 *                 type: string
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
 *                   description: Vehicle details updated successfully
 *       404:
 *         description: Driver not found
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
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while updating vehicle details
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
 *                   description: An error occurred while updating vehicle details
 */
router.patch('/vehicle-updates', updateVehicleDetails);

/**
 * @swagger
 * /api/v1/driver/dashboard/availability:
 *   patch:
 *     summary: Update driver availability and location
 *     tags: [Drivers]
 *     description: Update the availability and location of a driver by the driver's ID from the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *               longitude:
 *                 type: number
 *                 format: float
 *               driverId:
 *                 type: string
 *                 description: The ID of the driver
 *               socketId:
 *                 type: string
 *                 description: The socket ID of the driver
 *     responses:
 *       200:
 *         description: Availability and location updated successfully
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
 *                   description: Availability and location updated successfully
 *       404:
 *         description: Driver not found
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
 *                   description: Driver not found
 *       500:
 *         description: An error occurred while updating availability and location
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
 *                   description: An error occurred while updating availability and location
 */
router.patch('/availability', updateAvailability);

/**
 * @swagger
 * /api/v1/driver/dashboard/rating:
 *   patch:
 *     summary: Rate a Driver
 *     tags: [Driver Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The driver ID
 *               rating:
 *                 type: integer
 *                 description: The rating to give the Driver
 *     responses:
 *       200:
 *         description: The Driver was successfully rated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The status code
 *                 message:
 *                   type: string
 *                   description: The status message
 *                 newAverageRating:
 *                   type: number
 *                   description: The new average rating of the Driver
 *       404:
 *         description: The Driver was not found
 *       500:
 *         description: There was an error rating the Driver
 */
router.patch('/rating',validateDriverRating,  driverRating);

export default router;
