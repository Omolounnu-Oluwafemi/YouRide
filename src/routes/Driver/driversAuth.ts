import express from 'express';
import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { DriverSignup, DriverSignIn, verifyDriverSignIn } from '../../controllers/Driver/driversAuth'
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
 *                 enum: [Taxi Driver, Bus Driver, Delivery Driver]
 *               referralCode:
 *                 type: string
 *               vehicleYear:
 *                 type: string
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
 *                 Driver:
 *                   $ref: '#/components/schemas/Driver'
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
 *     tags: [Drivers Auth]
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
 *                 Driver:
 *                   $ref: '#/components/schemas/Driver'
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
 *     tags: [Drivers Auth]
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
 *                 Driver:
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
 *       properties:
 *         driverId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the driver
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The identifier for the category the driver belongs to
 *         countryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The identifier for the country the driver is in
 *         phoneNumber:
 *           type: string
 *           description: The driver's phone number
 *         country:
 *           type: string
 *           description: The country the driver is in
 *         email:
 *           type: string
 *           description: The driver's email address
 *         firstName:
 *           type: string
 *           description: The driver's first name
 *         lastName:
 *           type: string
 *           description: The driver's last name
 *         gender:
 *           type: string
 *           description: The driver's gender
 *         category:
 *           type: string
 *           description: The category the driver belongs to
 *         referralCode:
 *           type: string
 *           nullable: true
 *           description: The driver's referral code
 *         vehicleYear:
 *           type: string
 *           description: The year of the driver's vehicle
 *         vehicleManufacturer:
 *           type: string
 *           description: The manufacturer of the driver's vehicle
 *         vehicleColor:
 *           type: string
 *           description: The color of the driver's vehicle
 *         licensePlate:
 *           type: string
 *           description: The license plate number of the driver's vehicle
 *         driverLicense:
 *           type: string
 *           description: The driver's license number
 *         vehicleLogBook:
 *           type: string
 *           description: The log book of the driver's vehicle
 *         privateHireLicenseBadge:
 *           type: string
 *           description: The driver's private hire license badge
 *         insuranceCertificate:
 *           type: string
 *           description: The driver's insurance certificate
 *         motTestCertificate:
 *           type: string
 *           description: The driver's MOT test certificate
 *         isAvailable:
 *           type: boolean
 *           description: Whether the driver is available or not
 *         latitude:
 *           type: string
 *           description: The driver's latitude coordinate
 *         longitude:
 *           type: string
 *           description: The driver's longitude coordinate
 *         driverRating:
 *           type: number
 *           nullable: true
 *           description: The driver's rating
 *         numberOfRatings:
 *           type: integer
 *           description: The number of ratings the driver has received
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           nullable: true
 *           description: The driver's status
 *         dateOfBirth:
 *           type: string
 *           nullable: true
 *           description: The driver's date of birth
 *         verificationCode:
 *           type: string
 *           nullable: true
 *           description: The driver's verification code
 *         residenceAddress:
 *           type: string
 *           nullable: true
 *           description: The driver's residence address
 *         profileImage:
 *           type: string
 *           nullable: true
 *           description: The driver's profile image
 *         documentUpload:
 *           type: string
 *           nullable: true
 *           description: The driver's document upload
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
 *         - isAvailable
 *         - status
 */

export default router;
