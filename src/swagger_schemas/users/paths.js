module.exports = {
  '/users/create': {
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      description: 'Creates a new user account with the provided details.',
      operationId: 'createUser',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateUser' },
          },
        },
      },
      responses: {
        201: {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        400: { description: 'Invalid request parameters' },
        403: { description: 'Only admins can create users' },
      },
    },
  },

  '/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      description: 'Retrieve all users with optional filters and pagination.',
      operationId: 'getAllUsers',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: { type: 'integer' },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of users per page',
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
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

  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user details by ID',
      description: 'Retrieve details of a specific user by their ID.',
      operationId: 'getUserById',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to retrieve',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        404: { description: 'User not found' },
      },
    },
    put: {
      tags: ['Users'],
      summary: 'Update user details',
      description: 'Update the details of an existing user.',
      operationId: 'updateUser',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to update',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateUser' },
          },
        },
      },
      responses: {
        200: {
          description: 'User details updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        400: { description: 'Invalid update data' },
        404: { description: 'User not found' },
      },
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete user by ID',
      description: 'Delete a user by their ID.',
      operationId: 'deleteUser',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'User deleted successfully' },
        404: { description: 'User not found' },
      },
    },
  },

  '/users/reset-password/{id}': {
    patch: {
      tags: ['Users'],
      summary: 'Reset user password',
      description: 'Reset the password of a user and send new credentials via email.',
      operationId: 'resetPassword',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user whose password needs to be reset',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Password reset successfully' },
        404: { description: 'User not found' },
      },
    },
  },

  '/users/hard-delete/{id}': {
    delete: {
      tags: ['Users'],
      summary: 'Permanently delete user',
      description: 'Permanently delete a user by their ID.',
      operationId: 'hardDeleteUser',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to permanently delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'User permanently deleted successfully' },
        404: { description: 'User not found' },
      },
    },
  },
};
