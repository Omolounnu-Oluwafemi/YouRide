import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import countries from 'i18n-iso-countries';
import { v4 as uuidv4 } from "uuid";
import { Driver } from '../../models/drivers';
import cloudinary from '../../utils/cloudinary';
import  { sendVerificationCode } from '../../utils/email';
import { signToken, generateVerificationCode, signRefreshToken} from "../../utils/token";
import { VehicleCategory } from '../../models/vehicle';
import { Country } from '../../models/countries';

const uploadToCloudinary = async (fileBuffer: Buffer) => {
  let secure_url: string | undefined;

  await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'raw' }, (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error.message); // Log the error message
        reject(error.message);
      }
      if (result) {
        secure_url = result.secure_url;
        resolve(result);
      }
    }).end(fileBuffer);
  });

  if (!secure_url) {
    throw new Error('Failed to upload file to Cloudinary');
  }

  return secure_url;
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
      gender,
      category,
      referralCode,
      vehicleYear,
      vehicleManufacturer,
      vehicleColor,
      licensePlate,
      driverLicense,
      vehicleLogBook,
      privateHireLicenseBadge,
      insuranceCertificate,
      motTestCertificate
    } = req.body;

        // Parse the phone number to get the country code
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
    if (!parsedPhoneNumber) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid phone number'
      });
    }
    const countryCode = parsedPhoneNumber.country;
    if (!countryCode) {
      return res.status(400).json({
        status: 400,
        message: 'Country code could not be determined from the phone number'
      });
    }
    const country = countries.getName(countryCode, "en");

    // Check if the email or phoneNumber already exists in the database
    const existingDriver = await Driver.findOne({ 
      where: { 
        [Op.or]: [
          { email: email },
          { phoneNumber: phoneNumber }
        ] 
      } 
    });

    if (existingDriver) {
      let message = '';
      if (existingDriver.email === email) {
        message = 'Email already exists';
      } else if (existingDriver.phoneNumber === phoneNumber) {
        message = 'Phone number already exists';
      }
      return res.status(400).json({
        status: 400,
        message
      });
    }

    // Check if the country exists in the database
    const existingCountry = await Country.findOne({ 
      where: { 
        name: country as string
      } 
    });

    if (!existingCountry) {
      return res.status(400).json({
        status: 400,
        message: 'We do not operate in your country yet ' + country
      });
    }

    // Check if the category exists in the database
    const existingCategory = await VehicleCategory.findOne({ 
      where: { 
        categoryName: category 
      } 
    });

    if (!existingCategory) {
      return res.status(400).json({
        status: 400,
        message: 'Category does not exist'
      });
    } 

    try {
  // Upload files to Cloudinary and obtain URLs
  const driverLicenseUrl = await uploadToCloudinary(Buffer.from(driverLicense, 'base64'));
  const vehicleLogBookUrl = await uploadToCloudinary(Buffer.from(vehicleLogBook, 'base64'));
  const privateHireLicenseBadgeUrl = await uploadToCloudinary(Buffer.from(privateHireLicenseBadge, 'base64'));
  const insuranceCertificateUrl = await uploadToCloudinary(Buffer.from(insuranceCertificate, 'base64'));
  const motTestCertificateUrl = await uploadToCloudinary(Buffer.from(motTestCertificate, 'base64'));

      
    // Generate a JWT token for the user
    const token = signToken(driverId);
    const refreshToken = signRefreshToken(driverId);

      if (!country) {
      return res.status(400).json({
        status: 400,
        message: 'Country could not be determined from the phone number'
      });
    }
    // Create new Driver instance in database
    const driver = await Driver.create({
      driverId,
      countryId: existingCountry.countryId,
      categoryId: existingCategory.categoryId,
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
      isAvailable: false, 
      driverLicense: driverLicenseUrl,
      vehicleLogBook: vehicleLogBookUrl,
      privateHireLicenseBadge: privateHireLicenseBadgeUrl,
      insuranceCertificate: insuranceCertificateUrl,
      motTestCertificate: motTestCertificateUrl,
      latitude: '0',
      longitude: '0',
      numberOfRatings: 0 
    });

    // Send response
    res.status(201).json({
      status: 201,
      message: 'Driver created successfully',
      token: token,
      refreshToken: refreshToken,
      Driver: driver 
    });
  // Continue with your code...
} catch (error) {
  console.error('Failed to upload file:', error);
  res.status(500).json({ 
    status: 500,
    error: 'Failed to upload file' 
  });
}
  } catch (error) {
    if ((error as Error).name === 'ValidationError') {
      res.status(400).json({
        status: 400,
        error: (error as Error).message
      });
    } else {
      res.status(500).json({
        status: 500,
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
    const { verificationCode, driverId } = req.body;

     // Fetch the user from the database using the verification code
    const driver = await Driver.findOne({ where: { driverId, verificationCode } });

    if (!driver) {
      return res.status(404).json({
      status: 404,
        message: 'Sign up instead?',
        error: 'Driver not found',
      });
    }

      // If the verification code is valid, you might want to nullify it in the database
    driver.verificationCode = null;
    await driver.save();

    // const token = signToken(driver.driverId);
    // const refreshToken = signRefreshToken(driver.driverId); 

    return res.status(200).json({
      status: 200,
      message: 'Driver signed in successfully',
      // token: token,
      // refreshToken: refreshToken,
      Driver:  driver 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while verifying the code'
    });
  }
};


   