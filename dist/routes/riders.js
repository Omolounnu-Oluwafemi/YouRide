"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const drivers_1 = require("../controllers/drivers");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/driver-signup', upload.fields([
    { name: 'driverLicense', maxCount: 1 },
    { name: 'vehicleLogBook', maxCount: 1 },
    { name: 'privateHireLicenseBadge', maxCount: 1 },
    { name: 'insuranceCertificate', maxCount: 1 },
    { name: 'motTestCertificate', maxCount: 1 }
]), middleware_1.ValidateDriverSignup, drivers_1.DriverSignup);
exports.default = router;
