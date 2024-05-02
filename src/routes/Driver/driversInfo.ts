import express from 'express';
import { getDriverById } from '../../controllers/Driver/driversAuth';
import { deleteDriver, getAllDrivers, getAvailableDrivers, getAllDriversLocations } from '../../controllers/Driver/driversInfo';
import { isAdmin } from '../../utils/middleware';


const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/getonedriver/{driverId}:
 *   get:
 *     summary: Retrieve a Driver by their unique driverId
 *     tags: [Admin Dashboards]
 *     description: This endpoint retrieves driver's details using their unique identifier (driverId).
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the driver
 *     responses:
 *       200:
 *         description: Driver retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Driver ID is required
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
 *                   description: Driver ID is required
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
 *         description: An error occurred while retrieving driver
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
 *                   description: An error occurred while retrieving driver
 */
router.get('/getonedriver/:driverId', isAdmin, getDriverById);

/**
 * @swagger
 * /api/v1/admin/getalldrivers:
 *   get:
 *     summary: Retrieve a list of all drivers. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email to filter by.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: The phone number to filter by.
 *       - in: query
 *         name: driverLicense
 *         schema:
 *           type: string
 *         description: The driver's license to filter by.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The general search query to filter by.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The exact creation date to filter by.
 *     responses:
 *       200:
 *         description: A list of drivers.
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
 *                     $ref: '#/components/schemas/Driver'
 *       404:
 *         description: No available drivers found.
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
 *         description: An error occurred while processing your request.
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
router.get('/getalldrivers', isAdmin, getAllDrivers);

/**
 * @swagger
 * /api/v1/admin/getAvailableDrivers:
 *   get:
 *     summary: Retrieve a list of all available drivers. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The general search query to filter by.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The exact creation date to filter by.
 *     responses:
 *       200:
 *         description: A list of available drivers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 totalDrivers:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 drivers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Driver'
 *       404:
 *         description: No available drivers found.
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
 *         description: An error occurred while processing your request.
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
router.get('/getAvailableDrivers', isAdmin, getAvailableDrivers);

/**
 * @swagger
 * /api/v1/admin/getLocations:
 *   get:
 *     summary: Retrieve a list of all drivers' locations. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     responses:
 *       200:
 *         description: A list of drivers' locations.
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
 *                       driverId:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *       500:
 *         description: An error occurred while processing your request.
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
router.get('/getLocations', isAdmin, getAllDriversLocations);

/**
 * @swagger
 * /api/v1/admin/deletedriver/{driverId}:
 *   delete:
 *     summary: Delete a driver by ID. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The driver ID.
 *     responses:
 *       200:
 *         description: Driver deleted successfully.
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
 *                   description: The success message
 *       404:
 *         description: Driver not found.
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
 *         description: An error occurred while processing your request.
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
router.delete('/deletedriver/:driverId', isAdmin, deleteDriver)

export default router;