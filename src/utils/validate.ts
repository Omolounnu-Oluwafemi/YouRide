import Joi from 'joi'
import { isValidNumber } from 'libphonenumber-js';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}
enum Role {
    Admin = 'Admin',
    SuperAdmin = 'Super Admin',
}

export const initiialSignUpValidator = Joi.object().keys({
  phoneNumber: Joi.string().custom((value, helpers) => {
    if (!isValidNumber(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Phone Number Validation').error(errors => {
    errors.forEach(err => {
      if (err.code === 'any.invalid') {
        err.message = 'Invalid phone number format';
      }
    });
    return errors;
  }).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'
    }),
})
export const editPhoneNumberValidator = Joi.object().keys({
  phoneNumber: Joi.string().custom((value, helpers) => {
    if (!isValidNumber(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Phone Number Validation').error(errors => {
    errors.forEach(err => {
      if (err.code === 'any.invalid') {
        err.message = 'Invalid phone number format';
      }
    });
    return errors;
  }).required(),
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a string',
        'any.required': 'User ID is required'
    })
})
export const finalSignUpValidator = Joi.object().keys({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required'
    }),
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a string',
        'any.required': 'User ID is required'
    })
})
export const verificationCodeValidator = Joi.object().keys({
  verificationCode: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.base': 'Verification code must be a number',
    'number.integer': 'Verification code must be an integer',
    'number.min': 'Verification code must be at least 1000',
    'number.max': 'Verification code must be at most 9999',
    'any.required': 'Verification code is required'
  }),
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a string',
        'any.required': 'User ID is required'
    })
});
export const verificationDriverCodeValidator = Joi.object().keys({
  verificationCode: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.base': 'Verification code must be a number',
    'number.integer': 'Verification code must be an integer',
    'number.min': 'Verification code must be at least 1000',
    'number.max': 'Verification code must be at most 9999',
    'any.required': 'Verification code is required'
  }),
    driverId: Joi.string().required().messages({
        'string.base': 'User ID must be a string',
        'any.required': 'User ID is required'
    })
});
export const DriverSignupValidator = Joi.object({
  phoneNumber: Joi.string().custom((value, helpers) => {
    if (!isValidNumber(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Phone Number Validation').error(errors => {
    errors.forEach(err => {
      if (err.code === 'any.invalid') {
        err.message = 'Invalid phone number format';
      }
    });
    return errors;
  }).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
    'string.email': 'email must be a valid email'
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  gender: Joi.string().valid(...Object.values(Gender)).required().messages({
    'any.required': 'Gender is required',
    'any.only': 'Invalid gender'
  }),
  category: Joi.string().valid('Taxi Driver', 'Bus Driver', 'Delivery Driver'),
  referralCode: Joi.string().optional().allow(''),
  vehicleYear: Joi.string().pattern(/^(19|20)\d{2}$/).required().messages({
    'any.required': 'Vehicle year is required',
    'string.pattern.base': 'Invalid vehicle year',
  }),
  vehicleManufacturer: Joi.string().required().messages({
    'any.required': 'Vehicle manufacturer is required',
  }),
  vehicleColor: Joi.string().required().messages({
    'any.required': 'Vehicle color is required'
  }),
  licensePlate: Joi.string().required().messages({
    'any.required': 'License plate is required'
  }),
  driverLicense: Joi.string().base64().required().messages({
    'any.required': 'Driver license is required',
    'string.base64': 'Driver license must be a base64 encoded string'
  }),
  vehicleLogBook: Joi.string().base64().required().messages({
    'any.required': 'Vehicle log book is required',
    'string.base64': 'Vehicle log book must be a base64 encoded string'
  }),
  privateHireLicenseBadge: Joi.string().base64().required().messages({
    'any.required': 'Private hire license badge is required',
    'string.base64': 'Private hire license badge must be a base64 encoded string'
  }),
  insuranceCertificate: Joi.string().base64().required().messages({
    'any.required': 'Insurance certificate is required',
    'string.base64': 'Insurance certificate must be a base64 encoded string'
  }),
  motTestCertificate: Joi.string().base64().required().messages({
    'any.required': 'MOT test certificate is required',
    'string.base64': 'MOT test certificate must be a base64 encoded string'
  }),
  latitude: Joi.number().min(-90).max(90).messages({
    'number.base': 'Latitude must be a number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required'
  }),
  longitude: Joi.number().min(-180).max(180).messages({
    'number.base': 'Longitude must be a number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required'
  }),
});
export const AdminSignupValidator = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'
    }),
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required'
    }),
    role: Joi.string().valid(...Object.values(Role)).required().messages({
      'any.required': 'Category is required',
      'any.only': 'Invalid role'
    }),
});
export const AdminSignInValidator = Joi.object().keys({
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'}),
})
export const AdminPasswordUpdate = Joi.object().keys({
   tempPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
   newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
   email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'}),
})
export const BookTrip = Joi.object({
  tripId: Joi.string(),
  userId: Joi.string(),
  driverId: Joi.string().allow(null),
  pickupLocation: Joi.string().required(),
  dropoffLocation: Joi.string().required(),
  pickupTime: Joi.date().allow(null),
  dropoffTime: Joi.date().allow(null),
  status: Joi.string().valid('pending', 'accepted', 'in-progress', 'completed', 'cancelled'),
});
export const createVehicleSchema = Joi.object({
    country: Joi.string().required(),
    baseFare: Joi.number().required(),
    pricePerKMorMI: Joi.number().required(),
    pricePerMIN: Joi.number().required(),
    adminCommission: Joi.number().required(),
    status: Joi.string().valid('Active', 'Inactive').required(),
    categoryName: Joi.string().valid('Taxi Driver', 'Bus Driver', 'Delivery Driver'),
    vehicleName: Joi.string().valid('Datride Share', 'Datride Vehicle', 'Datride Delivery'),
    isSurge: Joi.boolean().required(),
    surgeStartTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    surgeEndTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    surgeType: Joi.string().valid('Percentage', 'Fixed'),
    carImage: Joi.string(),
    documentImage: Joi.string(),
    isDocVerified: Joi.boolean(),
});
export const updateVehicleSchema = Joi.object({
    baseFare: Joi.number(),
    pricePerKMorMI: Joi.number(),
    pricePerMIN: Joi.number(),
    adminCommission: Joi.number(),
    status: Joi.string().valid('Active', 'Inactive'),
    categoryName: Joi.string().valid('Taxi Driver', 'Bus Driver', 'Delivery Driver'),
    vehicleName: Joi.string().valid('Datride Share', 'Datride Vehicle', 'Datride Delivery'),
    isSurge: Joi.boolean(),
    surgeStartTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    surgeEndTime: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    surgeType: Joi.string().valid('Percentage', 'Fixed'),
    carImage: Joi.string(),
    documentImage: Joi.string(),
    isDocVerified: Joi.boolean(),
});
export const createTripSchema = Joi.object({
    country: Joi.string(),
    couponCode: Joi.string().required(),
    description: Joi.string(),
    usageLimit: Joi.number().integer().min(1).required(),
    perUserLimit: Joi.number().integer().min(1).required(),
    discount: Joi.number().min(0).max(100).required(),
    activationDate: Joi.date().iso().required(),
    expiryDate: Joi.date().iso().greater(Joi.ref('activationDate')).required(),
    validity: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY').required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'EXPIRED').required()
})
export const tripAmountschema = Joi.object({
  vehicleName: Joi.string().required(),
  totalDistance: Joi.number().required(),
  estimatedtime: Joi.number().required(),
  country: Joi.string().required(),
  voucher: Joi.string().optional().allow(''),
});
export const tripRequestSchema = Joi.object({
    country: Joi.string().required(),
    pickupLocation: Joi.string().required(),
    destination: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    tripAmount: Joi.number().required(),
    totalDistance: Joi.number().required(),
    pickupLatitude: Joi.number().required(),
    pickupLongitude: Joi.number().required(),
    destinationLatitude: Joi.number().required(),
    destinationLongitude: Joi.number().required(),
});
export const countrySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    currency: Joi.string().required(),
    usdConversionRatio: Joi.number().required(),
    distanceUnit: Joi.string().valid('KM', 'MI').required(),
    paymentOption: Joi.string().valid('Stripe Payment', 'Paystack Payment').required(),
});
export const editLocation = Joi.object({
  country: Joi.string().required(),
  state: Joi.string().required(),
  userId: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required'
  })
});
export const editHomeAddress = Joi.object({
  homeAddress: Joi.string().required(),
  userId: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required'
  })
});
export const editWorkAddress = Joi.object({
  workAddress: Joi.string().required(),
  userId: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required'
  })
});
export const communicationMethod = Joi.object({
  userId: Joi.string().required(),
  communicationMethod: Joi.string().valid('Call', 'Chat', 'Call or Chat').required()
});
export const ratingUserSchema = Joi.object({
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).precision(1).required(),
});
export const ratingDriverSchema = Joi.object({
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).precision(1).required(),
});
export const paymentOptionCreationSchema = Joi.object({
    paymentName: Joi.string().required(),
    privateKey: Joi.string().required(),
    publicKey: Joi.string().required(),
});
export const paymentOptionKeysSchema = Joi.object({
    privateKey: Joi.string().required(),
    publicKey: Joi.string().required(),
});
export const userUpdateByAdmin = Joi.object({
  country: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  homeAddress: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  status: Joi.string().required()
});
export const driverUpdateByAdmin = Joi.object({
    country: Joi.string().required(),
    firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
    }),
    gender: Joi.string().valid(...Object.values(Gender)).required().messages({
    'any.required': 'Gender is required',
    'any.only': 'Invalid gender'
    }),
    category: Joi.string().required().messages({
    'any.required': 'Category is required',
    }),
    vehicleYear: Joi.string().pattern(/^(19|20)\d{2}$/).required().messages({
    'any.required': 'Vehicle year is required',
    'string.pattern.base': 'Invalid vehicle year',
    }),
    vehicleManufacturer: Joi.string().required(),
    vehicleColor: Joi.string().required(),
    licensePlate: Joi.string().required().messages({
    'any.required': 'License plate is required'
    }),
    status: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    residenceAddress: Joi.string().required(),
});

export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
}