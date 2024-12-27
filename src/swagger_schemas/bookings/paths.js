module.exports = {
  '/api/bookings/add': {
    post: {
      tags: ['Bookings'],
      summary: 'Create a new booking',
      description: 'Create a new booking for a commuter',
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
              $ref: '#/components/schemas/BookingInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Booking created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Booking',
              },
            },
          },
        },
        400: {
          description: 'Invalid request data',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
      },
    },
  },
  '/api/bookings/my-bookings': {
    get: {
      tags: ['Bookings'],
      summary: 'Get user’s bookings',
      description: 'Retrieve a list of bookings made by the logged-in user',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Bookings retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Booking',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
      },
    },
  },
  '/api/bookings/': {
    get: {
      tags: ['Bookings'],
      summary: 'Get all bookings',
      description: 'Retrieve a list of all bookings (for operators)',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Bookings retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Booking',
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          description: 'Forbidden: You are not authorized to access this resource',
        },
      },
    },
  },
  '/api/bookings/{bookingId}/cancel': {
    put: {
      tags: ['Bookings'],
      summary: 'Cancel a booking',
      description: 'Cancel an existing booking made by a commuter',
      parameters: [
        {
          in: 'path',
          name: 'bookingId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'The unique ID of the booking to cancel',
        },
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Booking cancelled successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Booking',
              },
            },
          },
        },
        400: {
          description: 'Invalid request or booking already cancelled',
        },
        401: {
          $ref: '#/components/responses/UnauthorizedError',
        },
        403: {
          description: 'Forbidden: You are not authorized to cancel this booking',
        },
        404: {
          $ref: '#/components/responses/BookingNotFound',
        },
      },
    },
  },
};
