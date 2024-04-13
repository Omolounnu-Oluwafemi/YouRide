require("dotenv").config();
import swaggerJsdoc from "swagger-jsdoc";

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

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
