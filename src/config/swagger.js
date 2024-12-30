const bookingComponents = require('../swagger_schemas/bookings/components');
const bookingPaths = require('../swagger_schemas/bookings/paths');
const authComponents = require('../swagger_schemas/auth/components');
const authPaths = require('../swagger_schemas/auth/paths');
const busComponents = require('../swagger_schemas/buses/components');
const busPaths = require('../swagger_schemas/buses/paths');
const routeComponents = require('../swagger_schemas/routes/components');
const routePaths = require('../swagger_schemas/routes/paths');
const tripComponents = require('../swagger_schemas/trips/components');
const tripPaths = require('../swagger_schemas/trips/paths');
const userComponents = require('../swagger_schemas/users/components');
const userPaths = require('../swagger_schemas/users/paths');
const seatMapComponents = require('../swagger_schemas/seatMap/components');
const seatMapPaths = require('../swagger_schemas/seatMap/paths');
const permitComponents = require('../swagger_schemas/permit/components');
const permitMapPaths = require('../swagger_schemas/permit/paths');

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Bus Seat Booking API',
      version: '1.0.0',
      description: 'API documentation for bus seat booking system',
      contact: {
        name: 'Ovini Rajapaksha',
        email: 'ovirajapakdha@gmail.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...authComponents.schemas,
        ...bookingComponents.schemas,
        ...busComponents.schemas,
        ...routeComponents.schemas,
        ...tripComponents.schemas,
        ...userComponents.schemas,
        ...seatMapComponents.schemas,
        ...permitComponents.schemas,
      },
      responses: {
        ...authComponents.responses,
        ...bookingComponents.responses,
        ...busComponents.responses,
        ...routeComponents.responses,
        ...tripComponents.responses,
        ...userComponents.responses,
        ...seatMapComponents.responses,
        ...permitComponents.responses,
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints',
      },
      {
        name: 'Routes',
        description: 'Route management endpoints',
      },
      {
        name: 'Buses',
        description: 'Bus management endpoints',
      },
      {
        name: 'Trips',
        description: 'Trip management endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
    paths: {
      ...authPaths,
      ...bookingPaths,
      ...busPaths,
      ...routePaths,
      ...tripPaths,
      ...userPaths,
      ...seatMapPaths,
      ...permitMapPaths,
    },
  },
  apis: ['./routes/*.js', './models/*.js'],
};

module.exports = swaggerOptions;
