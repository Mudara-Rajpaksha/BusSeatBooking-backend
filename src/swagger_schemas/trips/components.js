module.exports = {
  schemas: {
    TripInput: {
      type: 'object',
      required: ['route', 'bus'],
      properties: {
        route: {
          type: 'string',
          format: 'uuid',
          description: 'The ID of the route for the trip',
        },
        bus: {
          type: 'string',
          format: 'uuid',
          description: 'The ID of the bus for the trip',
        },
        status: {
          type: 'string',
          enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
          default: 'SCHEDULED',
          description: 'The status of the trip',
        },
        availableSeats: {
          type: 'number',
          description: 'The number of available seats for the trip',
        },
      },
    },
    TripResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message for the operation',
        },
        data: {
          type: 'object',
          description: 'Trip data',
        },
      },
    },
    TripDetails: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'The unique ID of the trip',
        },
        route: {
          type: 'string',
          format: 'uuid',
          description: 'The route for the trip',
        },
        bus: {
          type: 'string',
          format: 'uuid',
          description: 'The bus assigned to the trip',
        },
        status: {
          type: 'string',
          enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
          description: 'The status of the trip',
        },
        availableSeats: {
          type: 'number',
          description: 'The number of available seats for the trip',
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the trip is active or not',
        },
      },
    },
    ApiResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Response message',
        },
      },
    },
  },
  responses: {
    UnauthorizedError: {
      description: 'Unauthorized request',
    },
    InvalidCredentials: {
      description: 'Invalid credentials provided',
    },
    TripNotFound: {
      description: 'Trip not found',
    },
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
