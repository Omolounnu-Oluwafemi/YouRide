import express from 'express';
import { isAdmin, validateVehicle } from '../../utils/middleware';
import { CreateVehicle, GetVehicles, EditVehicle, GetOneVehicle} from '../../controllers/Vehicle/vehicle';

const router = express.Router();

/**
 * @swagger
 * /api/v1/vehicles/get:
 *   get:
 *     summary: Get all vehicles
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Vehicles]
 *     description: Fetch all vehicles from the database. Only accessible by admins.
 *     responses:
 *       200:
 *         description: A list of vehicles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                     description: The country where the vehicle is located.
 *                   vehicleCategory:
 *                     type: string
 *                     enum: ['Taxi', 'Bus', 'Delivery']
 *                     description: The category of the vehicle.
 *                   baseFare:
 *                     type: number
 *                     format: float
 *                     description: The base fare for the vehicle.
 *                   pricePerKMorMI:
 *                     type: number
 *                     format: float
 *                     description: The price per KM or MI for the vehicle.
 *                   status:
 *                     type: string
 *                     enum: ['Active', 'Inactive']
 *                     description: The status of the vehicle.
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the vehicle was created.
 *             example:
 *               - country: "USA"
 *                 vehicleCategory: "Taxi"
 *                 baseFare: 10.00
 *                 pricePerKMorMI: 1.50
 *                 status: "Active"
 *                 date: "2022-01-01T00:00:00.000Z"
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
 *                 country:
 *                   type: string
 *                 baseFare:
 *                   type: number
 *                 pricePerKMorMI:
 *                   type: number
 *                 pricePerMIN:
 *                   type: number
 *                 adminCommission:
 *                   type: number
 *                 surgeStartTime:
 *                   type: string
 *                   format: date-time
 *                 surgeEndTime:
 *                   type: string
 *                   format: date-time
 *                 surgeType:
 *                   type: string
 *                 status:
 *                   type: string
 *                 carImage:
 *                   type: string
 *                 documentImage:
 *                   type: string
 *                 isDocVerified:
 *                   type: boolean
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: An error occurred
 */
router.get('/get/:vehicleId', isAdmin, GetOneVehicle);

/**
 * @swagger
 * /api/v1/vehicles/create:
 *   post:
 *     summary: Create a vehicle
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Vehicles]
 *     description: Create a new vehicle. Only accessible by admins.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: The country where the vehicle is located.
 *               baseFare:
 *                 type: number
 *                 format: float
 *                 description: The base fare for the vehicle.
 *               pricePerKMorMI:
 *                 type: number
 *                 format: float
 *                 description: The price per KM or MI for the vehicle.
 *               pricePerMIN:
 *                 type: number
 *                 format: float
 *                 description: The price per minute for the vehicle.
 *               adminCommission:
 *                 type: number
 *                 format: float
 *                 description: The admin commission for the vehicle.
 *               status:
 *                 type: string
 *                 enum: ['Active', 'Inactive']
 *                 description: The status of the vehicle.
 *               vehicleCategory:
 *                 type: string
 *                 enum: ['Taxi', 'Bus', 'Delivery']
 *                 description: The category of the vehicle.
 *               vehicleName:
 *                 type: string
 *                 enum: ['Datride Vehicle', 'Datride Share', 'Datride Delivery']
 *                 description: The name of the vehicle.
 *               isSurge:
 *                 type: boolean
 *                 description: Whether the vehicle is in surge pricing.
 *               surgeStartTime:
 *                 type: string
 *                 pattern: '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: The start time of the surge pricing.
 *               surgeEndTime:
 *                 type: string
 *                 pattern: '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: The end time of the surge pricing.
 *               surgeType:
 *                 type: string
 *                 enum: ['Percentage', 'Fixed']
 *                 description: The type of surge pricing.
 *               carImage:
 *                 type: string
 *                 description: The image of the car.
 *               documentImage:
 *                 type: string
 *                 description: The image of the document.
 *             example:
 *               country: "Nigeria"
 *               baseFare: 100
 *               pricePerKMorMI: 10
 *               pricePerMIN: 10
 *               adminCommission: 50
 *               status: "Active"
 *               vehicleCategory: "Taxi"
 *               vehicleName: "Datride Share"
 *               isSurge: false
 *               surgeStartTime: "08:00"
 *               surgeEndTime: "10:00"
 *               surgeType: "Percentage"
 *               carImage: "https://example.com/car.jpg"
 *               documentImage: "https://example.com/document.jpg"
 *     responses:
 *       200:
 *         description: The vehicle was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
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
 *                 message:
 *                   type: string
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: An error occurred
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