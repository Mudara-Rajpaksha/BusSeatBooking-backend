module.exports = {
  '/permits/add': {
    post: {
      tags: ['Permits'],
      summary: 'Create a new permit',
      description: 'Creates a new permit for a route and bus.',
      operationId: 'createPermit',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePermit' },
          },
        },
      },
      responses: {
        201: {
          description: 'Permit created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Permit' },
            },
          },
        },
        400: { description: 'Invalid request parameters' },
      },
    },
  },

  '/permits/{permitId}': {
    get: {
      tags: ['Permits'],
      summary: 'Get permit details',
      description: 'Retrieve details of a specific permit by ID',
      operationId: 'getPermit',
      parameters: [
        {
          name: 'permitId',
          in: 'path',
          required: true,
          description: 'ID of the permit to retrieve',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Permit details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Permit' },
            },
          },
        },
        404: { description: 'Permit not found' },
      },
    },
    put: {
      tags: ['Permits'],
      summary: 'Update an existing permit',
      description: 'Updates the status or expiry date of an existing permit.',
      operationId: 'updatePermit',
      parameters: [
        {
          name: 'permitId',
          in: 'path',
          required: true,
          description: 'ID of the permit to update',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePermit' },
          },
        },
      },
      responses: {
        200: {
          description: 'Permit updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Permit' },
            },
          },
        },
        404: { description: 'Permit not found' },
        400: { description: 'Invalid update data' },
      },
    },
    delete: {
      tags: ['Permits'],
      summary: 'Delete a permit',
      description: 'Deletes a permit by its ID.',
      operationId: 'deletePermit',
      parameters: [
        {
          name: 'permitId',
          in: 'path',
          required: true,
          description: 'ID of the permit to delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Permit deleted successfully' },
        404: { description: 'Permit not found' },
      },
    },
  },

  '/permits': {
    get: {
      tags: ['Permits'],
      summary: 'Get all permits',
      description: 'Retrieve all permits with optional filters and pagination.',
      operationId: 'getAllPermits',
      parameters: [
        {
          name: 'status',
          in: 'query',
          description: 'Filter permits by status',
          schema: { type: 'string', enum: ['active', 'expired', 'revoked'] },
        },
        {
          name: 'vehicleType',
          in: 'query',
          description: 'Filter permits by vehicle type',
          schema: { type: 'string', enum: ['bus', 'train', 'van'] },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: { type: 'integer' },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of permits per page',
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'List of permits',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  permits: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Permit' },
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid filters or pagination parameters' },
      },
    },
  },
};
