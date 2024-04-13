import { Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import  { sendVerificationCode } from '../utils/email';
import { signToken, generateVerificationCode} from "../utils/token";
import { User } from '../models/usersModel';
import { Op } from 'sequelize';

 interface SessionData {
   phoneNumber?: string;
   email?: string;
   verificationCode?: number;
  }

// Initial sign up
export const initialSignUp = async (req: Request, res: Response) => {
  try {

    const { phoneNumber, email } = req.body;

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
      return res.status(400).json({ message });
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
      message: 'Verification code sent to email',
      data: { verificationCode }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending code' });
  }
};

// Verify code
export const verifySignupCode = async (req: Request, res: Response) => {
  try {

    const { verificationCode } = req.body;

    // Convert both to string before comparing
    if (String(verificationCode) === String((req.session as SessionData).verificationCode)) {
      res.status(200).json({
        message: 'Verification successful',
        email: (req.session as SessionData).email,
        phoneNumber: (req.session as SessionData).phoneNumber,
      });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while verifying the code' });
  }
};

// Final sign up
export async function finalSignUp(req: Request, res: Response) {
  try {
    const userId = uuidv4();

    const { firstName, lastName } = req.body;

    // Generate a JWT token for the user
    const token = signToken(userId);

    // Create a new user in the database
    const newUser = await User.create({
      phoneNumber: (req.session as SessionData).phoneNumber as string,
      email: (req.session as SessionData).email as string,
      firstName,
      lastName,
      userId,
    });

    await newUser.save();

    return res.status(201).json({
      message: "New User created",
      token,
      data: { newUser }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error"
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
      message: 'Verification code sent to email',
      data: { verificationCode }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending code' });
  }
};

export async function verifySigninCode(req: Request, res: Response) {
  try {

    const { verificationCode } = req.body;

    // Check if the verification code matches the one in the session
    if (String((req.session as SessionData).verificationCode) !== String(verificationCode) ){
      return res.status(400).json({
        message: "Invalid verification code"
      });
    }

        // Check if user exists
    const user = await User.findOne({ where: { email: (req.session as SessionData).email, phoneNumber: (req.session as SessionData).phoneNumber } });
    if (!user) {
      return res.status(404).json({
        message: 'Sign up instead?',
        error: 'User not found',
      });
    }

    const token = signToken(user.userId);
    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
      status: 'success',
      message: 'User signed in successfully',
      data: { user }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while verifying the code' });
  }
};
