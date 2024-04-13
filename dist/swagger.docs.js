"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const { PORT } = process.env;
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "YouRide API",
        version: "1.0.0",
        description: "API documentation for Our Amazing Ride"
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: "Development server"
        }
    ]
};
const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts"]
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
