module.exports = {
  '/api/routes/add': {
    post: {
      tags: ['Routes'],
      summary: 'Add a new route',
      description: 'Create a new route with origin, destination, schedule, operator, and price',
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
              $ref: '#/components/schemas/RouteInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Route added successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RouteResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request, validation failed',
        },
        404: {
          description: 'Invalid operator or operator not found',
        },
        409: {
          description: 'Route already exists',
        },
      },
    },
  },
  '/api/routes': {
    get: {
      tags: ['Routes'],
      summary: 'Get all routes',
      description: 'Retrieve all routes with optional filters for origin, destination, and operator',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'origin',
          in: 'query',
          required: false,
          description: 'The origin of the route',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'destination',
          in: 'query',
          required: false,
          description: 'The destination of the route',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'operator',
          in: 'query',
          required: false,
          description: 'The operator of the route',
          schema: {
            type: 'string',
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
          description: 'Limit the number of routes returned',
          schema: {
            type: 'integer',
            example: 10,
          },
        },
        {
          name: 'skip',
          in: 'query',
          required: false,
          description: 'Skip a number of routes',
          schema: {
            type: 'integer',
            example: 0,
          },
        },
      ],
      responses: {
        200: {
          description: 'Routes retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/RouteDetails',
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
