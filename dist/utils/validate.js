"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.AdminPasswordUpdate = exports.AdminSignInValidator = exports.AdminSignupValidator = exports.DriverSignupValidator = exports.verificationCodeValidator = exports.finalSignUpValidator = exports.initiialSignUpValidator = void 0;
const joi_1 = __importDefault(require("joi"));
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
var Category;
(function (Category) {
    Category["PrivateDriver"] = "Private Driver";
    Category["TAxiDriver"] = "Taxi Driver";
    Category["DeliveryDriver"] = "Delivery Driver";
})(Category || (Category = {}));
var vehicleYear;
(function (vehicleYear) {
    vehicleYear["TwentyFour"] = "2024";
    vehicleYear["TwentyThree"] = "2023";
    vehicleYear["TwentyTwo"] = "2022";
    vehicleYear["TwentyOne"] = "2021";
    vehicleYear["Twenty"] = "2020";
    vehicleYear["Nineteen"] = "2019";
    vehicleYear["Eighteen"] = "2018";
})(vehicleYear || (vehicleYear = {}));
var Manufacturer;
(function (Manufacturer) {
    Manufacturer["ACE"] = "ACE";
    Manufacturer["Acura"] = "Acura";
    Manufacturer["AIWAYS"] = "AIWAYS";
    Manufacturer["AKT"] = "AKT";
    Manufacturer["BMW"] = "BMW";
    Manufacturer["BYD"] = "BYD";
    Manufacturer["Chevrolet"] = "Chevrolet";
})(Manufacturer || (Manufacturer = {}));
var Role;
(function (Role) {
    Role["Admin"] = "Admin";
    Role["SuperAdmin"] = "Super Admin";
})(Role || (Role = {}));
exports.initiialSignUpValidator = joi_1.default.object().keys({
    phoneNumber: joi_1.default.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
        'string.email': 'email must be a valid email'
    }),
});
exports.finalSignUpValidator = joi_1.default.object().keys({
    firstName: joi_1.default.string().required().messages({
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string().required().messages({
        'any.required': 'Last name is required'
    }),
});
exports.verificationCodeValidator = joi_1.default.object().keys({
    verificationCode: joi_1.default.number().integer().min(1000).max(9999).required().messages({
        'number.base': 'Verification code must be a number',
        'number.integer': 'Verification code must be an integer',
        'number.min': 'Verification code must be at least 1000',
        'number.max': 'Verification code must be at most 9999',
        'any.required': 'Verification code is required'
    }),
});
exports.DriverSignupValidator = joi_1.default.object({
    phoneNumber: joi_1.default.string().pattern(/^[0-9]{11}$/).message('Invalid phone number format').required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
        'string.email': 'email must be a valid email'
    }),
    firstName: joi_1.default.string().required().messages({
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string().required().messages({
        'any.required': 'Last name is required'
    }),
    country: joi_1.default.string().required().messages({
        'any.required': 'Country is required'
    }),
    gender: joi_1.default.string().valid(...Object.values(Gender)).required().messages({
        'any.required': 'Gender is required',
        'any.only': 'Invalid gender'
    }),
    category: joi_1.default.string().valid(...Object.values(Category)).required().messages({
        'any.required': 'Category is required',
        'any.only': 'Invalid category'
    }),
    referralCode: joi_1.default.string(),
    vehicleYear: joi_1.default.string().pattern(/^(19|20)\d{2}$/).valid(...Object.values(vehicleYear)).required().messages({
        'any.required': 'Vehicle year is required',
        'string.pattern.base': 'Invalid vehicle year',
        'any.only': 'Invalid vehicle year'
    }),
    vehicleManufacturer: joi_1.default.string().valid(...Object.values(Manufacturer)).required().messages({
        'any.required': 'Vehicle manufacturer is required',
        'any.only': 'Invalid vehicle manufacturer'
    }),
    vehicleColor: joi_1.default.string().required().messages({
        'any.required': 'Vehicle color is required'
    }),
    licensePlate: joi_1.default.string().required().messages({
        'any.required': 'License plate is required'
    }),
    vehicleNumber: joi_1.default.string().required().messages({
        'any.required': 'Vehicle number is required'
    }),
});
exports.AdminSignupValidator = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
        'string.email': 'email must be a valid email'
    }),
    firstName: joi_1.default.string().required().messages({
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string().required().messages({
        'any.required': 'Last name is required'
    }),
    role: joi_1.default.string().valid(...Object.values(Role)).required().messages({
        'any.required': 'Category is required',
        'any.only': 'Invalid role'
    }),
});
exports.AdminSignInValidator = joi_1.default.object().keys({
    password: joi_1.default.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
        'string.email': 'email must be a valid email'
    }),
});
exports.AdminPasswordUpdate = joi_1.default.object().keys({
    tempPassword: joi_1.default.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
    newPassword: joi_1.default.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/).message('Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.').required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).lowercase().required().messages({
        'string.email': 'email must be a valid email'
    }),
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
};
