module.exports = {
  '/api/bus/add': {
    post: {
      tags: ['Buses'],
      summary: 'Add a new bus',
      description: 'Add a new bus with registration number, seats, and amenities',
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
              $ref: '#/components/schemas/BusInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Bus added successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BusResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid data or bus already exists',
        },
      },
    },
  },
  '/api/bus': {
    get: {
      tags: ['Buses'],
      summary: 'Get all buses',
      description: 'Retrieve all buses with optional filtering, sorting, and pagination',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Buses retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/BusResponse',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request, invalid parameters',
        },
      },
    },
  },
};
