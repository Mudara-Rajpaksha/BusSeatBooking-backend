module.exports = {
  '/api/routes': {
    get: {
      tags: ['Routes'],
      summary: 'Get all routes',
      description: 'Retrieve a list of all routes based on specified filters and pagination options',
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filter by route status (e.g., active, inactive)',
        },
        {
          name: 'routeNumber',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filter by route number',
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
          },
          description: 'Page number for pagination',
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 10,
          },
          description: 'Number of routes per page',
        },
      ],
      responses: {
        200: {
          description: 'List of routes retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  routes: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Route',
                    },
                  },
                  total: {
                    type: 'integer',
                  },
                  page: {
                    type: 'integer',
                  },
                  limit: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid filters or pagination parameters',
        },
      },
    },
  },
  '/api/routes/add': {
    post: {
      tags: ['Routes'],
      summary: 'Create a new route',
      description: 'Create a new route with the specified details',
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
          description: 'Route successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Route',
              },
            },
          },
        },
        400: {
          description: 'Missing required fields or invalid data',
        },
      },
    },
  },
  '/api/routes/{routeId}': {
    get: {
      tags: ['Routes'],
      summary: 'Get route details',
      description: 'Retrieve details for a specific route by its ID',
      parameters: [
        {
          name: 'routeId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the route to retrieve',
        },
      ],
      responses: {
        200: {
          description: 'Route details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Route',
              },
            },
          },
        },
        404: {
          description: 'Route not found',
        },
      },
    },
    put: {
      tags: ['Routes'],
      summary: 'Update an existing route',
      description: 'Update an existing route by its ID with new details',
      parameters: [
        {
          name: 'routeId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the route to update',
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
        200: {
          description: 'Route successfully updated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Route',
              },
            },
          },
        },
        400: {
          description: 'Invalid route data provided',
        },
        404: {
          description: 'Route not found',
        },
      },
    },
    delete: {
      tags: ['Routes'],
      summary: 'Delete a route',
      description: 'Delete an existing route by its ID',
      parameters: [
        {
          name: 'routeId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the route to delete',
        },
      ],
      responses: {
        200: {
          description: 'Route successfully deleted',
        },
        404: {
          description: 'Route not found',
        },
      },
    },
  },
};
