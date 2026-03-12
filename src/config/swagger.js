const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerUrl =
  process.env.SWAGGER_URL || `http://localhost:${process.env.PORT || 5000}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MapHome API",
      version: "1.0.0",
      description: "API documentation for MapHome project",
    },
    tags: [
      { name: "Auth", description: "Authentication and user management" },
      { name: "Rooms", description: "Room listing, search and management" },
      { name: "Bookings", description: "Create and manage bookings" },
      { name: "Reports", description: "Reporting endpoints" },
      { name: "Admin", description: "Admin-only operations" },
      { name: "Favorites", description: "Room favorites and trending" },
    ],
    servers: [
      {
        url: swaggerUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Room: {
          type: "object",
          required: ["_id", "title", "price"],
          properties: {
            _id: { type: "string", example: "645a1f4c2b9a3f001234abcd" },
            title: { type: "string", example: "Cozy studio near downtown" },
            description: {
              type: "string",
              example:
                "Bright, fully-furnished studio with fast Wi-Fi and workspace",
            },
            price: { type: "number", format: "float", example: 350.5 },
            currency: { type: "string", example: "USD" },
            images: {
              type: "array",
              items: { type: "string", format: "uri" },
              example: ["https://.../img1.jpg", "https://.../img2.jpg"],
            },
            location: {
              type: "object",
              properties: {
                address: { type: "string", example: "123 Main St, City" },
                lat: { type: "number", example: 40.7128 },
                lng: { type: "number", example: -74.006 },
              },
            },
            favoritesCount: { type: "integer", example: 42 },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-10T12:34:56.789Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-11T08:12:00.000Z",
            },
          },
        },
      },
    },
  },
  // Look for JSDoc comments in route files
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
