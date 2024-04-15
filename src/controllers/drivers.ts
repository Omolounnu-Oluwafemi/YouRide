import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from "uuid";
import { Driver } from '../models/drivers';
import cloudinary from '../utils/cloudinary';
import  { sendVerificationCode } from '../utils/email';
import { signToken, generateVerificationCode} from "../utils/token";

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

interface SessionData {
   phoneNumber?: string;
   email?: string;
   verificationCode?: number;
}
  
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
      return res.status(400).json({ message });
    }

      // Check if all required files are present
      const requiredFiles = ['driverLicense', 'vehicleLogBook', 'privateHireLicenseBadge', 'insuranceCertificate', 'motTestCertificate'];
      for (const file of requiredFiles) {
        if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })[file] || (req.files as { [fieldname: string]: Express.Multer.File[] })[file].length === 0) {
          return res.status(400).json({ error: `${file} file is missing` });
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
      driverLicense: driverLicenseUrl,
      vehicleLogBook: vehicleLogBookUrl,
      privateHireLicenseBadge: privateHireLicenseBadgeUrl,
      insuranceCertificate: insuranceCertificateUrl,
      motTestCertificate: motTestCertificateUrl
    });

    // Send response
    res.status(201).json({
      message: 'Driver created successfully',
      token: token,
      newDriver
    });
  } catch (error) {
    if ((error as Error).name === 'ValidationError') {
      res.status(400).json({ error: (error as Error).message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const DriverSignIn = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;

      // Check if the email and the phone number already exists in the database
    const user = await Driver.findOne({ where: { email, phoneNumber } });
    if (!user) {
       return res.status(400).json({
        message: "User not found"
       });
    }
    
    // Store phoneNumber and email in session
    (req.session as SessionData).phoneNumber = phoneNumber;
    (req.session as SessionData).email = email;

    // Generate verification code
    const verificationCode = generateVerificationCode();
    (req.session as SessionData).verificationCode = verificationCode;

    // Send verification code to user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      message: 'Verification code sent to your email',
      data: { verificationCode }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending code' });
  }
};

export async function verifyDriverSignIn(req: Request, res: Response) {
  try {
    const { verificationCode } = req.body;

    // Check if the verification code matches the one in the session
    if (String((req.session as SessionData).verificationCode) !== String(verificationCode) ){
      return res.status(400).json({
        message: "Invalid verification code"
      });
    }

        // Check if user exists
    const driver = await Driver.findOne({ where: { email: (req.session as SessionData).email, phoneNumber: (req.session as SessionData).phoneNumber } });
    if (!driver) {
      return res.status(404).json({
        message: 'Sign up instead?',
        error: 'User not found',
      });
    }

    const token = signToken(driver.driverId);
    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
      status: 'success',
      message: 'User signed in successfully',
      data: { driver }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while verifying the code' });
  }
};

   