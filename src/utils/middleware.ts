import { NextFunction, Response, Request } from "express";
import { initiialSignUpValidator, finalSignUpValidator, verificationCodeValidator, AdminSignupValidator, AdminSignInValidator, AdminPasswordUpdate, options, BookRide, createRideOptionSchema, updateRideOptionSchema, createRideSchema } from "../utils/validate";
import { DriverSignupValidator } from '../utils/validate';
import rateLimit from 'express-rate-limit';
import { verifyAdminToken } from "./token";

export function validateFinalSignUp(req: Request, res: Response, next: NextFunction) {
  const { error } = finalSignUpValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  next();
}
export function validateInitialSignUp(req: Request, res: Response, next: NextFunction) {
  const { error } = initiialSignUpValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  next();
}
export function validateVerificationCode(req: Request, res: Response, next: NextFunction) {
  const { error } = verificationCodeValidator.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  next();
}
export function ValidateDriverSignup(req: Request, res: Response, next: NextFunction) {
      const { error } = DriverSignupValidator.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
  next();
}
export function ValidateAdminSignup(req: Request, res: Response, next: NextFunction) {
      const { error } = AdminSignupValidator.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
  next();
}
export function ValidateAdminSignIn(req: Request, res: Response, next: NextFunction) {
      const { error } = AdminSignInValidator.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
  next();
}
export function ValidateAdminPAsswordUpdate(req: Request, res: Response, next: NextFunction) {
      const { error } = AdminPasswordUpdate.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
  next();
}

export function generateTempPassword():string {
    const length = 10; // choose the length of the password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
  retVal = retVal.slice(0, length - 4) + 'A' + 'a' + '1' + '@';
  return retVal;
}

export const verifySignInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many attempts from this IP, please try again after 15 minutes'
});

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
        // Get the JWT token from the Authorization header or cookie
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

     let decoded;
    try {
      decoded = verifyAdminToken(token);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const role = decoded.role;
    // Check if the role is superadmin or admin
    if (role !== 'Super Admin') {
      return res.status(403).json({ message: 'You are not authorized to access this route' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

  try {
       // Get the JWT token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;
  

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

     let decoded;
    try {
      decoded = verifyAdminToken(token);
  
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const role = decoded.role;

    // Check if the role is superadmin or admin
    if (role !== 'Super Admin' && role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to access this route' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
export const validateBookRide = (req: Request, res: Response, next: NextFunction) => { 
  const { error } = BookRide.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
next();
}
export const validateCreateRideOption = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createRideOptionSchema.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
export const validateUpdateRideOption = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateRideOptionSchema.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateVoucherCreation = (req: Request, res: Response, next: NextFunction) => { 
  const { error } = createRideSchema.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
}
