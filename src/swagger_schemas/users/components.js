module.exports = {
  schemas: {
    UserInput: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: {
          type: 'string',
          description: 'The username of the user',
        },
        password: {
          type: 'string',
          description: 'The password of the user',
        },
        role: {
          type: 'string',
          enum: ['COMMUTER', 'ADMIN', 'OPERATOR'],
          description: 'The role of the user',
        },
        verified: {
          type: 'boolean',
          description: 'Whether the user is verified',
        },
        active: {
          type: 'boolean',
          description: 'Whether the user is active',
        },
      },
    },
    UserResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message for the operation',
        },
        data: {
          type: 'object',
          description: 'User data',
        },
      },
    },
    UserDetails: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'The unique ID of the user',
        },
        username: {
          type: 'string',
          description: 'The username of the user',
        },
        role: {
          type: 'string',
          enum: ['COMMUTER', 'ADMIN', 'OPERATOR'],
          description: 'The role of the user',
        },
        verified: {
          type: 'boolean',
          description: 'Whether the user is verified',
        },
        active: {
          type: 'boolean',
          description: 'Whether the user is active',
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
    UserNotFound: {
      description: 'User not found',
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
