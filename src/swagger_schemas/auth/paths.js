module.exports = {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Register a new commuter, operator, or admin user with a username and password',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request, user already exists or validation failed',
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login an existing user',
      description: 'Authenticate a user with their username and password and return access and refresh tokens',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful, tokens returned',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
        },
      },
    },
  },
  '/api/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh the access token using the refresh token',
      description: 'Allow a user to refresh their access token using the refresh token stored in cookies',
      security: [],
      responses: {
        200: {
          description: 'Access token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse',
              },
            },
          },
        },
        401: {
          description: 'Refresh token not found or invalid',
        },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get the logged-in user’s profile',
      description: 'Retrieve the logged-in user’s profile information based on the JWT token',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserProfile',
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
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout the user',
      description: 'Logout the user by invalidating the refresh token and clearing the cookie',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'User logged out successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse',
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
