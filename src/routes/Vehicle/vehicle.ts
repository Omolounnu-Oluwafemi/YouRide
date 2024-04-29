import express from 'express';
import { isAdmin, validateVehicle } from '../../utils/middleware';
import { CreateVehicle, GetVehicles, EditVehicle, GetOneVehicle} from '../../controllers/Vehicle/vehicle';

const router = express.Router();

/**
 * @swagger
 * /api/v1/vehicles/get:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     description: Fetch all vehicles from the database. Only accessible by admins.
 *     responses:
 *       200:
 *         description: A list of vehicles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                         description: The country where the vehicle is located.
 *                       vehicleCategory:
 *                         type: string
 *                         enum: ['Taxi', 'Bus', 'Delivery']
 *                         description: The category of the vehicle.
 *                       baseFare:
 *                         type: number
 *                         format: float
 *                         description: The base fare for the vehicle.
 *                       pricePerKMorMI:
 *                         type: number
 *                         format: float
 *                         description: The price per KM or MI for the vehicle.
 *                       status:
 *                         type: string
 *                         enum: ['Active', 'Inactive']
 *                         description: The status of the vehicle.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the vehicle was created.
 *             example:
 *               status: 200
 *               data:
 *                 - country: "USA"
 *                   vehicleCategory: "Taxi"
 *                   baseFare: 10.00
 *                   pricePerKMorMI: 1.50
 *                   status: "Active"
 *                   date: "2022-01-01T00:00:00.000Z"
 *       500:
 *         description: An error occurred while fetching Vehicles
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
 *                   example: An error occurred while fetching Vehicles
 */
router.get('/get', isAdmin, GetVehicles);

/**
 * @swagger
 * /api/v1/vehicles/get/{vehicleId}:
 *   get:
 *     summary: Get a vehicle
 *     tags: [Vehicles]
 *     description: Get the details of a specific vehicle
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the vehicle to get
 *     responses:
 *       200:
 *         description: Vehicle details retrieved successfully
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
 *                     country:
 *                       type: string
 *                     baseFare:
 *                       type: number
 *                     pricePerKMorMI:
 *                       type: number
 *                     pricePerMIN:
 *                       type: number
 *                     adminCommission:
 *                       type: number
 *                     surgeStartTime:
 *                       type: string
 *                       format: date-time
 *                     surgeEndTime:
 *                       type: string
 *                       format: date-time
 *                     surgeType:
 *                       type: string
 *                     status:
 *                       type: string
 *                     carImage:
 *                       type: string
 *                     documentImage:
 *                       type: string
 *                     isDocVerified:
 *                       type: boolean
 *             example:
 *               status: 200
 *               data:
 *                 country: "USA"
 *                 baseFare: 10.00
 *                 pricePerKMorMI: 1.50
 *                 pricePerMIN: 0.20
 *                 adminCommission: 2.00
 *                 surgeStartTime: "2022-01-01T00:00:00.000Z"
 *                 surgeEndTime: "2022-01-01T01:00:00.000Z"
 *                 surgeType: "Peak"
 *                 status: "Active"
 *                 carImage: "https://example.com/car.jpg"
 *                 documentImage: "https://example.com/doc.jpg"
 *                 isDocVerified: true
 *       404:
 *         description: Vehicle not found
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
 *                   example: Vehicle not found
 *       500:
 *         description: An error occurred
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
 *                   example: An error occurred
 */
router.get('/get/:vehicleId', isAdmin, GetOneVehicle);

/**
 * @swagger
 * /api/v1/vehicles/create:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     description: Create a new vehicle record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               baseFare:
 *                 type: number
 *               pricePerKMorMI:
 *                 type: number
 *               pricePerMIN:
 *                 type: number
 *               adminCommission:
 *                 type: number
 *               status:
 *                 type: string
 *               vehicleCategory:
 *                 type: string
 *               vehicleName:
 *                 type: string
 *               carImage:
 *                 type: string
 *               documentImage:
 *                 type: string
 *               isSurge:
 *                 type: boolean
 *               surgeStartTime:
 *                 type: string
 *                 format: date-time
 *               surgeEndTime:
 *                 type: string
 *                 format: date-time
 *               surgeType:
 *                 type: string
 *               isDocVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vehicle created successfully
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
 *                 vehicle:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: string
 *                     driverId:
 *                       type: string
 *                     country:
 *                       type: string
 *                     baseFare:
 *                       type: number
 *                     pricePerKMorMI:
 *                       type: number
 *                     pricePerMIN:
 *                       type: number
 *                     adminCommission:
 *                       type: number
 *                     isSurge:
 *                       type: boolean
 *                     surgeStartTime:
 *                       type: string
 *                       format: date-time
 *                     surgeEndTime:
 *                       type: string
 *                       format: date-time
 *                     surgeType:
 *                       type: string
 *                     status:
 *                       type: string
 *                     vehicleCategory:
 *                       type: string
 *                     vehicleName:
 *                       type: string
 *                     carImage:
 *                       type: string
 *                     documentImage:
 *                       type: string
 *                     isDocVerified:
 *                       type: boolean
 *             example:
 *               status: 200
 *               message: "Vehicle created successfully"
 *               vehicle: 
 *                 vehicleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 driverId: null
 *                 country: "USA"
 *                 baseFare: 10.00
 *                 pricePerKMorMI: 1.50
 *                 pricePerMIN: 0.20
 *                 adminCommission: 2.00
 *                 isSurge: false
 *                 surgeStartTime: "2022-01-01T00:00:00.000Z"
 *                 surgeEndTime: "2022-01-01T01:00:00.000Z"
 *                 surgeType: "Peak"
 *                 status: "Active"
 *                 vehicleCategory: "Sedan"
 *                 vehicleName: "Toyota Camry"
 *                 carImage: "https://example.com/car.jpg"
 *                 documentImage: "https://example.com/doc.jpg"
 *                 isDocVerified: true
 *       500:
 *         description: An error occurred
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
 *                   example: An error occurred while creating the vehicle
 */
router.post('/create', isAdmin, validateVehicle, CreateVehicle);

/**
 * @swagger
 * /api/v1/vehicles/update/{vehicleId}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     description: Update the details of a specific vehicle
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               baseFare:
 *                 type: number
 *               pricePerKMorMI:
 *                 type: number
 *               pricePerMIN:
 *                 type: number
 *               adminCommission:
 *                 type: number
 *               status:
 *                 type: string
 *               vehicleCategory:
 *                 type: string
 *               carImage:
 *                 type: string
 *               documentImage:
 *                 type: string
 *               isSurge:
 *                 type: boolean
 *               surgeStartTime:
 *                 type: string
 *                 format: date-time
 *               surgeEndTime:
 *                 type: string
 *                 format: date-time
 *               surgeType:
 *                 type: string
 *               isDocVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
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
 *             example:
 *               status: 200
 *               message: "Vehicle updated successfully"
 *       404:
 *         description: Vehicle not found
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
 *                   example: Vehicle not found
 *       500:
 *         description: An error occurred
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
 *                   example: An error occurred
 */
router.put('/update/:vehicleId', isAdmin, validateVehicle, EditVehicle);

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         vehicleId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the vehicle.
 *         country:
 *           type: string
 *           description: The country where the vehicle operates.
 *         baseFare:
 *           type: number
 *           format: float
 *           description: The base fare for the vehicle.
 *         pricePerKMorMI:
 *           type: number
 *           format: float
 *           description: The price per KM or MI for the vehicle.
 *         pricePerMIN:
 *           type: number
 *           format: float
 *           description: The price per minute for the vehicle.
 *         adminCommission:
 *           type: number
 *           format: float
 *           description: The admin commission for the vehicle.
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           description: The status of the vehicle.
 *         vehicleCategory:
 *           type: string
 *           enum: [Taxi, Bus, Delivery]
 *           description: The category of the vehicle.
 *         vehicleName:
 *           type: string
 *           enum: [Datride Vehicle, Datride Share, Datride Delivery]
 *           description: The name of the vehicle.
 *         carImage:
 *           type: string
 *           format: uri
 *           description: The URL of the car image.
 *         documentImage:
 *           type: string
 *           format: uri
 *           description: The URL of the document image.
 *         isSurge:
 *           type: boolean
 *           description: Whether surge pricing is enabled.
 *         surgeStartTime:
 *           type: string
 *           format: time
 *           description: The start time for surge pricing.
 *         surgeEndTime:
 *           type: string
 *           format: time
 *           description: The end time for surge pricing.
 *         surgeType:
 *           type: string
 *           enum: [Percentage, Fixed]
 *           description: The type of surge pricing.
 *         isDocVerified:
 *           type: boolean
 *           description: Whether the vehicle's documents are verified.
 *       required:
 *         - country
 *         - baseFare
 *         - pricePerKMorMI
 *         - pricePerMIN
 *         - adminCommission
 *         - status
 *         - vehicleCategory
 *         - isSurge
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