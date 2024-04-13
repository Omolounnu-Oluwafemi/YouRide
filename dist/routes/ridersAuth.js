"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const riders_1 = require("../controllers/riders");
/* GET home page. */
router.post('/rider-signup', riders_1.RiderSignup);
exports.default = router;
