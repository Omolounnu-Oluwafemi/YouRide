import { Response, Request, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import  { sendVerificationCode } from '../../utils/email';
import { signToken, generateVerificationCode, signRefreshToken} from "../../utils/token";
import { User } from '../../models/usersModel';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import countries from 'i18n-iso-countries';
import cloudinary  from '../../utils/cloudinary';

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

export const initialSignUp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;
    const userId = uuidv4();

    // Check if the email or phoneNumber already exists in the database
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber }
        ] 
      } 
    });

    if (existingUser) {
      let message = '';
      if (existingUser.email === req.body.email) {
        message = 'Email already exists';
      } else if (existingUser.phoneNumber === req.body.phoneNumber) {
        message = 'Phone number already exists';
      }
      return res.status(400).json({
        status: 400,
        message
      });
    }

    // Parse the phone number and extract the country
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
    let country = parsedPhoneNumber ? parsedPhoneNumber.country : null;

    // If country cannot be detected, throw an error
    if (!country) {
      return res.status(400).json({
        status: 400,
        message: 'Please provide a valid phone number with your country code'
      });
    }

    // Convert country code to country name
    let countryName: string | undefined;
    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
    countryName = countries.getName(country as string, "en");

    // Generate verification code
    const verificationCode = generateVerificationCode().toString();

    // Create new user with phoneNumber, email, and verificationCode
    const newUser = await User.create({
      userId,
      phoneNumber,
      email,
      country: countryName || '', 
      ssoProvider: "DatRide",
      verificationCode,
      numberOfRatings: 0,
      wallet: 0.0,
    });

    // Send verification code to user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      status: 200,
      message: 'Verification code sent to email',
      data: {
        userId,
        verificationCode
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      message: 'An error occurred while sending code'
    });
  }
};
export const verifySignupCode = async (req: Request, res: Response) => {
  try {
    const { verificationCode, userId } = req.body;

    const user = await User.findOne({ where: { userId, verificationCode } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid verification code or user ID'
      });
    }

    user.verificationCode = null;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Verification successful',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while verifying the code'
    });
  }
};
export async function finalSignUp(req: Request, res: Response) {
  try {
    const { firstName, lastName, userId} = req.body;

    // Find the user by their email or phone number
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found'
      });
    }

    // Update the user details
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();

    const token = signToken(user.userId);
    const refreshToken = signRefreshToken(user.userId);

    return res.status(200).json({
      status: 200,
      message: "User updated",
      token: token,
      refreshToken: refreshToken,
      data: { user }
    });
  } catch (error) {
     console.log(error)
    return res.status(500).json({
      status: 500,
      message: "Internal server error"
    });
  }
}
export const signInUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;

    // Check if the email and the phone number already exists in the database
    const user = await User.findOne({ where: { email, phoneNumber } });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User not found"
      });
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode().toString();

    // Update user with new verification
    user.verificationCode = verificationCode;
    const updatedUser = await user.save();

    // Send verification code to user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      status: 200,
      message: 'Verification code sent to email',
      data: { 
        verificationCode,
        userId: user.userId,
      }
    });
  } catch (error) {
     console.log(error)
    res.status(500).json({
      status: 500,
      message: 'An error occurred while sending code'
    });
  }
};
export async function verifySigninCode(req: Request, res: Response) {
  try {
    const { verificationCode, userId } = req.body;

     // Fetch the user from the database using the verification code
    const user = await User.findOne({ where: { userId, verificationCode } });

    if (!user) {
      return res.status(400).json({
        status: 404,
        message: 'Sign up instead?',
        error: 'verification not successful!',
      });
    }

    // If the verification code is valid, you might want to nullify it in the database
    user.verificationCode = null;
    await user.save();

    const token = signToken(user.userId);
    const refreshToken = signRefreshToken(user.userId); 

    return res.status(200).json({
      status: 200,
      message: 'User signed in successfully',
      token: token,
      refreshToken: refreshToken,
      data: { user }
    });
  } catch (error) {
     console.log(error)
    res.status(500).json({
      status: 500,
      message: 'An error occurred while verifying the code'
    });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'User retrieved successfully',
      data: { user }
    });
  } catch (error) {
     console.log(error)
    res.status(500).json({
      status: 500,
      message: 'An error occurred while retrieving user'
    });
  }
};
export const socialSignInUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.user as Express.User & { email: string };

      // Check if the email and the phone number already exists in the database
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: 400,
          message: "User not found"
        });
      }
      const token = signToken(user.userId);
      const refreshToken = signRefreshToken(user.userId);
      // Set the token in a cookie
      res.cookie('token', token, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.status(200).json({
      status: 200,
      message: 'User signed in successfully',
      token: token,
      refreshToken: refreshToken,
      data: { user },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while sending code'
    });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not provided');
  }
  try {
    const decoded = jwt.verify(token, secret) as { id: string };

    // Check if the user exists
    const user = await User.findOne({ where: { userId: decoded.id } });
    if (!user) {
      return res.status(403).json({
        status: 403,
        error: 'User not found'
      });
    }

    const newRefreshToken = signRefreshToken(decoded.id);
    const newToken = signToken(decoded.id);

    return res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully',
      newRefreshToken,
      newToken
    });

  } catch (error) {
     console.log(error)
    return res.status(403).json({
      status:403,
      error: 'Invalid or expired refresh token'
    });
  }
}
export const editName = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();
    return res.status(200).json({
      status: 200,
      message: 'Name updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while updating the user name'
    });
  }
};
export const editPhoneNumber = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    const existingPhoneNumber = user.phoneNumber

      if (existingPhoneNumber) {
      return res.status(400).json({
        status: 400,
        message: 'Phone number already in use'
      });
    }

    user.phoneNumber = phoneNumber;

    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Phone number updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while updating the user phone number'
    });
  }
};
export const editLocation = async (req: Request, res: Response) => {
  try {
    const { country, state, userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }
    const phoneNumber = parsePhoneNumberFromString(user.phoneNumber);

    if (!phoneNumber) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid phone number'
      });
    }
    const currentCountry = phoneNumber.country;

    if (!currentCountry) {
      return res.status(400).json({
        status: 400,
        message: 'Country code could not be determined from the phone number'
      });
    }
    const currentCountryName = countries.getName(currentCountry, 'en');

    if (currentCountryName !== country) {
      return res.status(400).json({
        status: 400,
        message: 'The new country does not match the country code in your phone number. Please update your phone number first.'
      });
    }

    user.country = country;
    user.state = state;

    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'User location updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while updating the user location'
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: 200,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while deleting the user'
    });
  }
};
export const addHomeAddress = async (req: Request, res: Response) => {
  try {
    const { userId, homeAddress } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    user.homeAddress = homeAddress;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Home address added successfully',
      data: { user }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while adding the home address'
    });
  }
};
export const addWorkAddress = async (req: Request, res: Response) => {
  try {
    const { userId, workAddress } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    user.workAddress = workAddress;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Work address added successfully',
      data: { user }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while adding the work address'
    });
  }
};
export const communicationMethod = async (req: Request, res: Response) => {
  try {
    const { userId, communicationMethod } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found'
      });
    }

    user.communicationMethod = communicationMethod;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: 'Communication method updated successfully',
      data: { user }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'An error occurred while updating the communication method'
    });
  }
};
export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const profilePictureFile = req.file;

    const user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found'
      });
    }

    let profilePictureUrl;
    try {
      if (profilePictureFile) {
        profilePictureUrl = await uploadToCloudinary(profilePictureFile);
      } else {
        throw new Error('Profile picture file is undefined');
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Failed to upload image'
      });
    }

    user.profileImage = profilePictureUrl;
    try {
      await user.save();
    } catch (error) {
      return res.status(500).json({
        status: 500, 
        error: 'Failed to update Image'
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Profile picture updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: 500,
      error: 'Error updating profile picture' });
  }
};
export const userRating = async (req: Request, res: Response) => {
  try {
    const { userId, rating } = req.body;

    // Find the user by userId
    const user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User not found'
      });
    }
    // Calculate the new average rating
    const newAverageRating = (user.userRating + rating) / (user.numberOfRatings + 1);

    // Update the user's rating and number of ratings
    user.userRating = newAverageRating;
    user.numberOfRatings += 1;
    await user.save();

    // Return a response
    res.status(200).json({
      status: 200,
      message: 'User rated successfully',
      newAverageRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: 500,
      error: 'Error rating user' 
    });
  }
};