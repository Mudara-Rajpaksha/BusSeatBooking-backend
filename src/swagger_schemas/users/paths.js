module.exports = {
  '/api/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      description: 'Retrieve all users with optional filters for username, role, etc.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'username',
          in: 'query',
          required: false,
          description: 'The username to filter users by',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'role',
          in: 'query',
          required: false,
          description: 'The role to filter users by',
          schema: {
            type: 'string',
            enum: ['COMMUTER', 'ADMIN', 'OPERATOR'],
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
          description: 'Limit the number of users returned',
          schema: {
            type: 'integer',
            example: 10,
          },
        },
        {
          name: 'skip',
          in: 'query',
          required: false,
          description: 'Skip a number of users',
          schema: {
            type: 'integer',
            example: 0,
          },
        },
      ],
      responses: {
        200: {
          description: 'Users retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/UserDetails',
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
  '/api/users/role/{role}': {
    get: {
      tags: ['Users'],
      summary: 'Get users by role',
      description: 'Retrieve users by their role (commuter, admin, operator)',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'role',
          in: 'path',
          required: true,
          description: 'The role to filter users by',
          schema: {
            type: 'string',
            enum: ['COMMUTER', 'ADMIN', 'OPERATOR'],
          },
        },
      ],
      responses: {
        200: {
          description: 'Users by role retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/UserDetails',
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid role provided',
        },
        401: {
          description: 'Unauthorized, invalid or expired token',
        },
      },
    },
  },
};
