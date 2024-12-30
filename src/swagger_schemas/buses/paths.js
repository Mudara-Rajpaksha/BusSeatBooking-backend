module.exports = {
  '/api/buses': {
    get: {
      tags: ['Buses'],
      summary: 'Get all buses',
      description: 'Retrieve a list of all buses based on specified filters and pagination options',
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filter by bus status (e.g., active, inactive)',
        },
        {
          name: 'manufacturer',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filter by bus manufacturer',
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
          description: 'Number of buses per page',
        },
      ],
      responses: {
        200: {
          description: 'List of buses retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  buses: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Bus',
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
  '/api/buses/add': {
    post: {
      tags: ['Buses'],
      summary: 'Create a new bus',
      description: 'Create a new bus with the specified details',
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
          description: 'Bus successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Bus',
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
  '/api/buses/{busId}': {
    get: {
      tags: ['Buses'],
      summary: 'Get bus details',
      description: 'Retrieve details for a specific bus by its ID',
      parameters: [
        {
          name: 'busId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the bus to retrieve',
        },
      ],
      responses: {
        200: {
          description: 'Bus details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Bus',
              },
            },
          },
        },
        404: {
          description: 'Bus not found',
        },
      },
    },
    put: {
      tags: ['Buses'],
      summary: 'Update an existing bus',
      description: 'Update an existing bus by its ID with new details',
      parameters: [
        {
          name: 'busId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the bus to update',
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
        200: {
          description: 'Bus successfully updated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Bus',
              },
            },
          },
        },
        400: {
          description: 'Invalid bus data provided',
        },
        404: {
          description: 'Bus not found',
        },
      },
    },
    delete: {
      tags: ['Buses'],
      summary: 'Delete a bus',
      description: 'Delete an existing bus by its ID',
      parameters: [
        {
          name: 'busId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the bus to delete',
        },
      ],
      responses: {
        200: {
          description: 'Bus successfully deleted',
        },
        404: {
          description: 'Bus not found',
        },
      },
    },
  },
};
