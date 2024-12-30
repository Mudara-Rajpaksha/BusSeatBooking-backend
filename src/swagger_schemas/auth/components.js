module.exports = {
  schemas: {
    RegisterInput: {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        firstname: {
          type: 'string',
          description: 'The first name of the user',
        },
        lastname: {
          type: 'string',
          description: 'The last name of the user',
        },
        email: {
          type: 'string',
          description: 'The email address of the user',
        },
        mobile: {
          type: 'string',
          description: 'The mobile number of the user',
        },
        username: {
          type: 'string',
          description: 'The username of the new user',
        },
        password: {
          type: 'string',
          description: 'The password for the new user',
        },
        role: {
          type: 'string',
          enum: ['commuter', 'operator', 'admin'],
          description: 'The role of the new user',
        },
      },
    },
    LoginInput: {
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
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message for the operation',
        },
        accessToken: {
          type: 'string',
          description: 'The generated access token',
        },
        refreshToken: {
          type: 'string',
          description: 'The generated refresh token',
        },
      },
    },
    UserProfile: {
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
          enum: ['commuter', 'operator', 'admin'],
          description: 'The role of the user',
        },
        verified: {
          type: 'boolean',
          description: 'Whether the user is verified',
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
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};
