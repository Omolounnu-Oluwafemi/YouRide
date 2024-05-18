import { Response, Request, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import  { sendVerificationCode } from '../../utils/email';
import { signToken, generateVerificationCode, signRefreshToken} from "../../utils/token";
import { User } from '../../models/usersModel';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import countries from 'i18n-iso-countries';


export const initialSignUp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, email } = req.body;

    const userId = uuidv4();

      // Parse the phone number and extract the country
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
    let country = parsedPhoneNumber ? parsedPhoneNumber.country : null;

    // Convert country code to country name
    
    let countryName: string | null = null;
    if (country) {
        countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
        countryName = countries.getName(country, "en") || null;
      }

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

    // Generate verification code
    const verificationCode = generateVerificationCode().toString();

    // Create new user with phoneNumber, email, and verificationCode
    const newUser = await User.create({
      userId,
      phoneNumber,
      email,
      country: countryName,
      firstName: "",
      lastName: "",
      googleId: "",
      facebookId: "",
      appleId: "",
      ssoProvider: "DatRide",
      verificationCode
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
    const { verificationCode } = req.body;
    const { userId } = req.params;

    // Fetch the user from the database using the verification code
    const user = await User.findOne({ where: { userId, verificationCode } });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid verification code or user ID'
      });
    }

    // If the verification code is valid, you might want to nullify it in the database
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
    const { firstName, lastName } = req.body;
    const { userId } = req.params;

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
    await User.update({ verificationCode }, { where: { email } });

    // Send verification code to user's email
    await sendVerificationCode(email, verificationCode);

    return res.status(200).json({
      status: 200,
      message: 'Verification code sent to email',
      data: { 
        verificationCode,
        userId: user.userId
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'An error occurred while sending code'
    });
  }
};

export async function verifySigninCode(req: Request, res: Response) {
  try {
    const { verificationCode } = req.body;
    const { userId } = req.params;

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
    res.status(500).json({
      status: 500,
      message: 'An error occurred while verifying the code'
    });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "User ID is required"
      });
    }

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
          message: "User not found"
        });
      }
       const token = signToken(user.userId);
      const refreshToken = signRefreshToken(user.userId);
      // Set the token in a cookie
      res.cookie('token', token, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.status(200).json({
      status: 'success',
       message: 'User signed in successfully',
      token: token,
      refreshToken: refreshToken,
      data: { user },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending code' });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while signing out' });
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
      return res.status(403).json({ error: 'User not found' });
    }

    const newRefreshToken = signRefreshToken(decoded.id);
    const newToken = signToken(decoded.id)

    return res.status(200).json({
      message: 'Token refreshed successfully',
      newRefreshToken,
      newToken
    });

  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
}