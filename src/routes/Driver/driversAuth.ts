import express from 'express';
import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { DriverSignup, DriverSignIn, verifyDriverSignIn, getDriverById } from '../../controllers/Driver/driversAuth'
import { ValidateDriverSignup, validateInitialSignUp, validateDriverVerificationCode, verifySignInLimiter, convertFilesToBase64, checkInternetConnectionMiddleware } from '../../utils/middleware';
import { deleteDriver } from '../../controllers/Driver/driversInfo';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit file size to 10MB
  },
});

 const processUploads = upload.fields([
  { name: 'driverLicense', maxCount: 1 },
  { name: 'vehicleLogBook', maxCount: 1 },
  { name: 'privateHireLicenseBadge', maxCount: 1 },
  { name: 'insuranceCertificate', maxCount: 1 },
  { name: 'motTestCertificate', maxCount: 1 },
]);

router.use(checkInternetConnectionMiddleware);
/**
 * @swagger
 * /api/v1/driver/signup:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               category:
 *                 type: string
 *               referralCode:
 *                 type: string
 *               vehicleYear:
 *                 type: integer
 *               vehicleManufacturer:
 *                 type: string
 *               vehicleColor:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               driverLicense:
 *                 type: string
 *                 format: binary
 *               vehicleLogBook:
 *                 type: string
 *                 format: binary
 *               privateHireLicenseBadge:
 *                 type: string
 *                 format: binary
 *               insuranceCertificate:
 *                 type: string
 *                 format: binary
 *               motTestCertificate:
 *                 type: string
 *                 format: binary
 *             required:
 *               - phoneNumber
 *               - email
 *               - firstName
 *               - lastName
 *               - gender
 *               - category
 *               - vehicleYear
 *               - vehicleManufacturer
 *               - vehicleColor
 *               - licensePlate
 *               - driverLicense
 *               - vehicleLogBook
 *               - privateHireLicenseBadge
 *               - insuranceCertificate
 *               - motTestCertificate
 *     responses:
 *       201:
 *         description: Driver created successfully
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
 *                   description: The response message
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *                 data:
 *                   type: object
 *                   properties:
 *                     Driver:
 *                       type: object
 *                       description: The Driver object
 *       400:
 *         description: Bad request
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
 *       500:
 *         description: Server error
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
 */
router.post('/signup', processUploads, convertFilesToBase64, ValidateDriverSignup, DriverSignup);

/**
 * @swagger
 * /api/v1/driver/signin:
 *   post:
 *     summary: Sign in a driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code sent to your email
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *       400:
 *         description: User not found
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
 *       500:
 *         description: An error occurred while sending code
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
 */
router.post('/signin', validateInitialSignUp, DriverSignIn);

/**
 * @swagger
 * /api/v1/driver/verify:
 *   post:
 *     summary: Verify a driver's sign in
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationCode, driverId]
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: The verification code of the driver.
 *               driverId:
 *                 type: string
 *                 description: The ID of the driver.
 *     responses:
 *       200:
 *         description: User signed in successfully
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
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Invalid verification code
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while verifying the code
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
 */
router.post('/verify', validateDriverVerificationCode, verifySignInLimiter, verifyDriverSignIn)

/**
 * @swagger
 * /api/v1/driver/getonedriver/{driverId}:
 *   get:
 *     summary: Retrieve a Driver by their unique driverId
 *     tags: [Driver Account]
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
router.get('/getonedriver/:driverId', getDriverById);

/**
 * @swagger
 * /api/v1/driver/deletedriver/{driverId}:
 *   delete:
 *     summary: Driver can delete there account by ID.
 *     tags: [Driver Account]
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
router.delete('/deletedriver/:driverId', deleteDriver);

// Error handling middleware
router.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size limit exceeded' });
  }
  // Handle any other errors
  next(err);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - driverId
 *         - phoneNumber
 *         - country
 *         - email
 *         - firstName
 *         - lastName
 *         - gender
 *         - category
 *         - vehicleYear
 *         - vehicleManufacturer
 *         - vehicleColor
 *         - licensePlate
 *         - driverLicense
 *         - vehicleLogBook
 *         - privateHireLicenseBadge
 *         - insuranceCertificate
 *         - motTestCertificate
 *       properties:
 *         driverId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *         phoneNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         country:
 *           type: string
 *         latitude:
 *           type: number
 *           format: float
 *         longitude:
 *           type: number
 *           format: float
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         category:
 *           type: string
 *         referralCode:
 *           type: string
 *         vehicleYear:
 *           type: integer
 *         vehicleManufacturer:
 *           type: string
 *         vehicleColor:
 *           type: string
 *         licensePlate:
 *           type: string
 *         vehicleNumber:
 *           type: string
 *         driverLicense:
 *           type: string
 *         vehicleLogBook:
 *           type: string
 *         privateHireLicenseBadge:
 *           type: string
 *         insuranceCertificate:
 *           type: string
 *         motTestCertificate:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *         verificationCode:
 *           type: string
 */

export default router;
