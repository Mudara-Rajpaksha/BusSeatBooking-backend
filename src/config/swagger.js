const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bus Seat Booking API',
      version: '1.0.0',
      description: 'API documentation for bus seat booking system',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    tags: [
      { name: 'Auth' },
      { name: 'Routes' },
      { name: 'Permit' },
      { name: 'Buses' },
      { name: 'Seat Mapping' },
      { name: 'Trip' },
      { name: 'Booking' },
      { name: 'Users' },
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registration',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'johndoe@example.com',
                    mobile: '1234567890',
                    username: 'johndoe',
                    password: 'StrongPassword123',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {},
              },
            },
          },
        },
      },
      '/auth/updateMe/{id}': {
        put: {
          tags: ['Auth'],
          summary: 'Update me',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'johndoe@example.com',
                    mobile: '1234567890',
                    username: 'johndoe',
                    password: 'StrongPassword321',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {},
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    username: 'johndoe',
                    password: 'StrongPassword321',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {},
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerOptions;
