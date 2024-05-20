import { NextFunction, Response, Request } from "express";
import dns from 'dns';
import { initiialSignUpValidator, finalSignUpValidator, verificationCodeValidator, AdminSignupValidator, AdminSignInValidator, AdminPasswordUpdate,options, createVehicleSchema, createTripSchema, tripRequestSchema, DriverSignupValidator, countrySchema, verificationDriverCodeValidator, updateVehicleSchema, editPhoneNumberValidator, editLocation, editHomeAddress, editWorkAddress, communicationMethod, ratingUserSchema, ratingDriverSchema, paymentOptionCreationSchema, paymentOptionKeysSchema, userUpdateByAdmin, driverUpdateByAdmin} from "../utils/validate";
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
export function validateDriverVerificationCode(req: Request, res: Response, next: NextFunction) {
  const { error } = verificationDriverCodeValidator.validate(req.body);
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
    console.log(errors)
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
export const validatetripRequest = (req: Request, res: Response, next: NextFunction) => { 
  const { error } = tripRequestSchema.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
next();
}
export const validateVehicle = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createVehicleSchema.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
export const validateVehicleUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateVehicleSchema.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
export const validateVoucherCreation = (req: Request, res: Response, next: NextFunction) => { 
  const { error } = createTripSchema.validate(req.body, options);
  if (error) {
    const errors = error.details.map((err: { message: any; }) => err.message);
    return res.status(400).json({
      errors
    });
  }
}
export const validateCountryCreation = (req: Request, res: Response, next: NextFunction)=>{
  const { error } = countrySchema.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}
export const validateEditPhoneNumber = (req: Request, res: Response, next: NextFunction)=>{
  const { error } = editPhoneNumberValidator.validate(req.body, options);
  if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}
export const validateEditLocation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = editLocation.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateHomeAddress = (req: Request, res: Response, next: NextFunction) => {
  const { error } = editHomeAddress.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateWorkAddress = (req: Request, res: Response, next: NextFunction) => {
  const { error } = editWorkAddress.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validatecommunicationMethod = (req: Request, res: Response, next: NextFunction) => {
  const { error } = communicationMethod.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateUserRating = (req: Request, res: Response, next: NextFunction) => {
  const { error } = ratingUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validatepaymentOptionCreation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = paymentOptionCreationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validatepaymentOptionKeys = (req: Request, res: Response, next: NextFunction) => {
  const { error } = paymentOptionKeysSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateDriverRating = (req: Request, res: Response, next: NextFunction) => {
  const { error } = ratingDriverSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateDriverUpdateByAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = driverUpdateByAdmin.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
export const validateUserUpdateByAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userUpdateByAdmin.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};

export const convertFilesToBase64 = (req: Request, res: Response, next: NextFunction) => {
  if (req.files) {
    for (const file of Object.values(req.files)) {
      req.body[file[0].fieldname] = file[0].buffer.toString('base64');
    }
  }
  next();
};

export const checkInternetConnection = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    dns.resolve('www.google.com', (err) => {
      if (err) {
        reject(new Error('No internet connection'));
      } else {
        resolve();
      }
    });
  });
};
export const checkInternetConnectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  checkInternetConnection()
    .then(() => next())
    .catch((err) => res.status(503).send(err.message));
};