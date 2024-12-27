module.exports = {
  '/api/trips/add': {
    post: {
      tags: ['Trips'],
      summary: 'Create a new trip',
      description: 'Create a new trip by specifying the route, bus, and other relevant details',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/TripInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Trip created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TripResponse',
              },
            },
          },
        },
        404: {
          description: 'Route or Bus not found',
        },
        400: {
          description: 'Bad request, validation failed',
        },
      },
    },
  },
  '/api/trips': {
    get: {
      tags: ['Trips'],
      summary: 'Get all trips',
      description: 'Retrieve all trips with optional filters for route, bus, status, etc.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'route',
          in: 'query',
          required: false,
          description: 'The route ID for the trip',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'bus',
          in: 'query',
          required: false,
          description: 'The bus ID for the trip',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'status',
          in: 'query',
          required: false,
          description: 'The status of the trip',
          schema: {
            type: 'string',
            enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
          },
        },
        {
          name: 'sort',
          in: 'query',
          required: false,
          description: 'Sort the results by the specified field',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Limit the number of trips returned',
          schema: {
            type: 'integer',
            example: 10,
          },
        },
        {
          name: 'skip',
          in: 'query',
          required: false,
          description: 'Skip a number of trips',
          schema: {
            type: 'integer',
            example: 0,
          },
        },
      ],
      responses: {
        200: {
          description: 'Trips retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TripDetails',
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized, invalid or expired token',
        },
      },
    },
  },
};
