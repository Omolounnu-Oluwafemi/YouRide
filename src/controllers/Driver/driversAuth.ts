import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import { Driver } from '../../models/drivers';
import cloudinary from '../../utils/cloudinary';
import  { sendVerificationCode } from '../../utils/email';
import { signToken, generateVerificationCode, signRefreshToken} from "../../utils/token";

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};
  
export const DriverSignup = async (req: Request, res: Response) => {
  try {
    // Generate driver ID
    const driverId = uuidv4();

    // Extract driver data from request body
    const {
      phoneNumber,
      email,
      firstName,
      lastName,
      country,
      gender,
      category,
      referralCode,
      vehicleYear,
      vehicleManufacturer,
      vehicleColor,
      licensePlate,
      vehicleNumber,
    } = req.body;

    // Check if the email or phoneNumber already exists in the database
    const existingDriver = await Driver.findOne({ 
      where: { 
        [Op.or]: [
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber }
        ] 
      } 
    });

    if (existingDriver) {
      let message = '';
      if (existingDriver.email === req.body.email) {
        message = 'Email already exists';
      } else if (existingDriver.phoneNumber === req.body.phoneNumber) {
        message = 'Phone number already exists';
      }
      return res.status(400).json({
        status: 400,
        message
      });
    }

      // Check if all required files are present
      const requiredFiles = ['driverLicense', 'vehicleLogBook', 'privateHireLicenseBadge', 'insuranceCertificate', 'motTestCertificate'];
      for (const file of requiredFiles) {
        if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })[file] || (req.files as { [fieldname: string]: Express.Multer.File[] })[file].length === 0) {
          return res.status(400).json({
            statu: 400,
            error: `${file} file is missing`
          });
        }
      }

      // Upload files to Cloudinary and obtain URLs
      const driverLicenseUrl = await uploadToCloudinary((req.files as { [fieldname: string]: Express.Multer.File[] })['driverLicense'][0]);
      const vehicleLogBookUrl = await uploadToCloudinary((req.files as { [fieldname: string]: Express.Multer.File[] })['vehicleLogBook'][0]);
      const privateHireLicenseBadgeUrl = await uploadToCloudinary((req.files as { [fieldname: string]: Express.Multer.File[] })['privateHireLicenseBadge'][0]);
      const insuranceCertificateUrl = await uploadToCloudinary((req.files as { [fieldname: string]: Express.Multer.File[] })['insuranceCertificate'][0]);
      const motTestCertificateUrl = await uploadToCloudinary((req.files as { [fieldname: string]: Express.Multer.File[] })['motTestCertificate'][0]);

     // Generate a JWT token for the user
    const token = signToken(driverId);

    // Create new Rider instance in database
    const newDriver = await Driver.create({
      driverId,
      vehicleId: null,
      phoneNumber,
      email,
      country,
      firstName,
      lastName,
      gender,
      category,
      referralCode,
      vehicleYear,
      vehicleManufacturer,
      vehicleColor,
      licensePlate,
      vehicleNumber,
      isAvailable: false, 
      driverLicense: driverLicenseUrl,
      vehicleLogBook: vehicleLogBookUrl,
      privateHireLicenseBadge: privateHireLicenseBadgeUrl,
      insuranceCertificate: insuranceCertificateUrl,
      motTestCertificate: motTestCertificateUrl,
      latitude: '0',
      longitude: '0'
    });

    // Send response
    res.status(201).json({
      status: 201,
      message: 'Driver created successfully',
      token: token,
      newDriver
    });
  } catch (error) {
    if ((error as Error).name === 'ValidationError') {
      res.status(400).json({
        status: 400,
        error: (error as Error).message
      });
    } else {
      res.status(500).json({
        status: 400,
        error: (error as Error).message
      });
    }
  }
}
export const DriverSignIn = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;

      // Check if the email and the phone number already exists in the database
    const driver = await Driver.findOne({ where: { email, phoneNumber } });
    if (!driver) {
      return res.status(400).json({
         status: 400,
        message: "Driver not found"
       });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode().toString();

    // Update user with new verification
    await Driver.update({ verificationCode }, { where: { email } });

    // Send verification code to user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      status: 200,
      message: 'Verification code sent to your email',
      data: {
        verificationCode,
        driverId: driver.driverId
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'An error occurred while sending code'
    });
  }
};
export async function verifyDriverSignIn(req: Request, res: Response) {
  try {
    const { verificationCode } = req.body;
    const { driverId } = req.params;

     // Fetch the user from the database using the verification code
    const driver = await Driver.findOne({ where: { driverId, verificationCode } });

    if (!driver) {
      return res.status(404).json({
      status: 404,
        message: 'Sign up instead?',
        error: 'User not found',
      });
    }

      // If the verification code is valid, you might want to nullify it in the database
    driver.verificationCode = null;
    await driver.save();

    const token = signToken(driver.driverId);
    const refreshToken = signRefreshToken(driver.driverId); 

    return res.status(200).json({
      status: 200,
      message: 'User signed in successfully',
      token: token,
      refreshToken: refreshToken,
      data: { driver }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while verifying the code'
    });
  }
};
export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({
        status: 400,
        message: "Driver ID is required"
      });
    }

    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    return res.status(200).json({
      status: 200,
      message: 'Driver retrieved successfully',
      data: { driver }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'An error occurred while retrieving driver'
    });
  }
};

   