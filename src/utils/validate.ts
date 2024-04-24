import Joi from 'joi'

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}
enum Category {
    PrivateDriver = 'Private Driver',
    TAxiDriver = 'Taxi Driver',
    DeliveryDriver = 'Delivery Driver'
}
enum vehicleYear {
    TwentyFour = '2024',
    TwentyThree = '2023',
    TwentyTwo = '2022',
    TwentyOne = '2021',
    Twenty = '2020',
    Nineteen = '2019',
    Eighteen = '2018',
}
enum Manufacturer {
    ACE = 'ACE',
    Acura = 'Acura',
    AIWAYS = 'AIWAYS',
    AKT = 'AKT',
    BMW = 'BMW',
    BYD = 'BYD',
    Chevrolet = 'Chevrolet'
}
enum Role {
    Admin = 'Admin',
    SuperAdmin = 'Super Admin',
}

export const initiialSignUpValidator = Joi.object().keys({
    phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'
    }),
})
export const finalSignUpValidator = Joi.object().keys({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required'
    }),
})
export const verificationCodeValidator = Joi.object().keys({
  verificationCode: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.base': 'Verification code must be a number',
    'number.integer': 'Verification code must be an integer',
    'number.min': 'Verification code must be at least 1000',
    'number.max': 'Verification code must be at most 9999',
    'any.required': 'Verification code is required'
  }),
});
export const DriverSignupValidator = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
      'string.email': 'email must be a valid email'
    }),
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required'
    }),
    country: Joi.string().required().messages({
      'any.required': 'Country is required'
    }),
    gender: Joi.string().valid(...Object.values(Gender)).required().messages({
      'any.required': 'Gender is required',
      'any.only': 'Invalid gender'
    }),
    category: Joi.string().valid(...Object.values(Category)).required().messages({
      'any.required': 'Category is required',
      'any.only': 'Invalid category'
    }),
    referralCode: Joi.string().optional().allow(''),
    vehicleYear: Joi.string().pattern(/^(19|20)\d{2}$/).valid(...Object.values(vehicleYear)).required().messages({
      'any.required': 'Vehicle year is required',
      'string.pattern.base': 'Invalid vehicle year',
      'any.only': 'Invalid vehicle year'
    }),
    vehicleManufacturer: Joi.string().valid(...Object.values(Manufacturer)).required().messages({
      'any.required': 'Vehicle manufacturer is required',
      'any.only': 'Invalid vehicle manufacturer'
    }),
    vehicleColor: Joi.string().required().messages({
      'any.required': 'Vehicle color is required'
    }),
    licensePlate: Joi.string().required().messages({
      'any.required': 'License plate is required'
    }),
    vehicleNumber: Joi.string().required().messages({
      'any.required': 'Vehicle number is required'
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
  destination: Joi.string().required(),
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
    vehicleCategory: Joi.string().valid('Taxi', 'Bus', 'Delivery').required(),
    vehicleName: Joi.string().valid('Datride Share', 'Datride Vehicle', 'Datride Delivery').required(),
    isSurge: Joi.boolean().required(),
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
  distance: Joi.number().required(),
  estimatedtime: Joi.number().required(),
  country: Joi.string().required(),
  voucher: Joi.string().optional().allow(''),
});
export const tripRequestSchema = Joi.object({
    country: Joi.string().required(),
    pickupLocation: Joi.string().required(),
    destination: Joi.string().required(),
    vehicleName: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    tripAmount: Joi.number().required(),
    totalDistance: Joi.number().required(),
    pickupLatitude: Joi.number().required(),
    pickupLongitude: Joi.number().required(),
    destinationLatitude: Joi.number().required(),
    destinationLongitude: Joi.number().required(),
});
export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
}

