import express from 'express';
import multer from 'multer';
import { isAdmin, validateVehicle, validateVehicleUpdate } from '../../utils/middleware';
import { CreateVehicleCategory, GetVehicleCategories, EditVehicleCategory, GetOneVehicleCategory, DeleteVehicleCategory } from '../../controllers/Admin/vehicle';

const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();

/**
 * @swagger
 * /api/v1/vehiclecategories/get:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Admin Dashboards]
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
 *       404:
 *         description: No vehicle categories found
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
 *                   example: No vehicle categories found
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
router.get('/get', isAdmin, GetVehicleCategories);

/**
 * @swagger
 * /api/v1/vehicleCategories/get/{categoryId}:
 *   get:
 *     summary: Get a vehicle
 *     tags: [Admin Dashboards]
 *     description: Get the details of a specific vehicle
 *     parameters:
 *       - in: path
 *         name: categoryId
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
router.get('/get/:categoryId', isAdmin, GetOneVehicleCategory);

/**
 * @swagger
 * /api/v1/vehicleCategories/create:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Admin Dashboards]
 *     description: Create a new vehicle record
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               categoryName:
 *                 type: string
 *               vehicleName:
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
 *               carImage:
 *                 type: string
 *                 format: binary
 *               documentImage:
 *                 type: string
 *                 format: binary
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
 *                     categoryId:
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
 *                     categoryName:
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
 *               category: 
 *                 categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 driverId: null
 *                 country: "USA"
 *                 baseFare: 10.00
 *                 pricePerKMorMI: 1.50
 *                 pricePerMIN: 0.20
 *                 adminCommission: 2.00
 *                 isSurge: false
 *                 surgeStartTime: "22:00"
 *                 surgeEndTime: "23:00"
 *                 surgeType: "Peak"
 *                 status: "Active"
 *                 categoryName: "Taxi Driver"
 *                 vehicleName: "Datride Vehicle"
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
router.post('/create', upload.fields([{ name: 'carImage', maxCount: 1 }, { name: 'documentImage', maxCount: 1 }]), isAdmin, validateVehicle, CreateVehicleCategory);

/**
 * @swagger
 * /api/v1/vehicleCategories/update/{categoryId}:
 *   patch:
 *     summary: Update a vehicle
 *     tags: [Admin Dashboards]
 *     description: Update the details of a specific vehicle
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
 *                 format: binary
 *               documentImage:
 *                 type: string
 *                 format: binary
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
router.patch('/update/:categoryId', upload.fields([{ name: 'carImage', maxCount: 1 }, { name: 'documentImage', maxCount: 1 }]), isAdmin, validateVehicleUpdate, EditVehicleCategory);

/**
 * @swagger
 * /api/v1/vehicleCategories/delete/{categoryId}:
 *   delete:
 *     summary: Delete a vehicle category
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the vehicle category
 *     responses:
 *       200:
 *         description: The vehicle category was deleted successfully
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
 *       404:
 *         description: The vehicle category was not found
 *       500:
 *         description: There was an error
 */
router.delete('/delete/:categoryId', isAdmin, DeleteVehicleCategory)

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleCategories:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the vehicle.
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
 *         categoryName:
 *           type: string
 *           enum: [Taxi Driver, Bus Driver, Delivery Driver]
 *           description: The category of the vehicle.
 *         vehicleName:
 *           type: string  
 *           enum: [Datride Vehicle, Datride Share, Datride Delivery]
 *           description: The category of the vehicle.
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
 *         - baseFare
 *         - pricePerKMorMI
 *         - pricePerMIN
 *         - adminCommission
 *         - status
 *         - categoryName
 *         - isSurge
 */
export default router;