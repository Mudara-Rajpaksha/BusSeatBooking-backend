module.exports = {
  schemas: {
    RouteInput: {
      type: 'object',
      required: ['origin', 'destination', 'schedule', 'operator', 'price'],
      properties: {
        origin: {
          type: 'string',
          description: 'The origin of the route',
        },
        destination: {
          type: 'string',
          description: 'The destination of the route',
        },
        schedule: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Schedule in HH:00 AM/PM format',
          },
          description: 'The schedule of the route',
        },
        operator: {
          type: 'string',
          format: 'uuid',
          description: 'The ID of the operator for the route',
        },
        price: {
          type: 'number',
          description: 'The price for the route',
        },
      },
    },
    RouteResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message for the operation',
        },
        data: {
          type: 'object',
          description: 'Route data',
        },
      },
    },
    RouteDetails: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'The unique ID of the route',
        },
        origin: {
          type: 'string',
          description: 'The origin of the route',
        },
        destination: {
          type: 'string',
          description: 'The destination of the route',
        },
        schedule: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Schedule in HH:00 AM/PM format',
          },
        },
        operator: {
          type: 'string',
          format: 'uuid',
          description: 'The operator of the route',
        },
        price: {
          type: 'number',
          description: 'The price for the route',
        },
        isActive: {
          type: 'boolean',
          description: 'Status of the route',
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
    RouteNotFound: {
      description: 'Route not found',
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
