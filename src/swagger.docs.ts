require("dotenv").config();
import swaggerJsdoc from "swagger-jsdoc";
const { PORT, NODE_ENV, PROD_URL } = process.env;

const servers = [
  {
    url: NODE_ENV === 'production' ? PROD_URL : `http://localhost:${PORT}`,
    description: NODE_ENV === 'production' ? "Production server" : "Development server",
  },
];
const swaggerDefinition = {
  openapi: "3.0.0", 
  info: {
    title: "DatRide API",
    version: "1.0.0",
    description: "API documentation for Our Amazing Ride"
  },
  servers,
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;