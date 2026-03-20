# Swagger API Documentation Guide

Your MapHome API now has Swagger UI documentation!

## Accessing Swagger UI

Once your server is running, visit:

```
http://localhost:5000/api-docs
```

## How to Document Your Routes

Add JSDoc comments with Swagger annotations above your route definitions. Here's a template for GET, POST, PUT, and DELETE endpoints:

### POST Endpoint Example

```javascript
/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     description: Creates a new property listing
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - address
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cozy Apartment
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               price:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post("/", createProperty);
```

### GET Endpoint Example

```javascript
/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     description: Retrieve a list of all available properties
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", getProperties);
```

### GET by ID Endpoint Example

```javascript
/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get("/:id", getPropertyById);
```

### PUT Endpoint Example

```javascript
/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       404:
 *         description: Property not found
 */
router.put("/:id", updateProperty);
```

### DELETE Endpoint Example

```javascript
/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 */
router.delete("/:id", deleteProperty);
```

## Common Data Types in Swagger

- `string`, `number`, `integer`, `boolean`, `array`, `object`
- For dates: `type: string, format: date-time`
- For files: `type: string, format: binary`

## Tags

Organize endpoints using tags (e.g., `Properties`, `Users`, `Authentication`)

## Next Steps

1. Update all route files (propertyRoutes.js, userRoutes.js, bookingRoutes.js, etc.) with Swagger documentation
2. Use consistent tags for related endpoints
3. Document request bodies, parameters, and response schemas
4. Update the swagger.js config to ensure all routes are included

## Configuration

The Swagger configuration is in `src/config/swagger.js`. Routes are automatically scanned from `src/routes/*.js` files.
