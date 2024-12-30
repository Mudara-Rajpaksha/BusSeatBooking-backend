module.exports = {
  '/api/bookings/available-trips': {
    get: {
      tags: ['Bookings'],
      summary: 'Find available trips',
      description: 'Retrieve a list of available trips based on specified criteria',
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AvailableTripsInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'List of available trips retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/AvailableTripsResponse',
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid input',
        },
      },
    },
  },
  '/api/bookings/{tripId}/seat-availability': {
    get: {
      tags: ['Bookings'],
      summary: 'Get seat availability for a trip',
      description: 'Check the availability of seats for a specific trip',
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the trip to check seat availability for',
        },
        {
          name: 'fromStop',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The starting stop of the trip',
        },
        {
          name: 'toStop',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ending stop of the trip',
        },
      ],
      responses: {
        200: {
          description: 'Seat availability retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    seatId: {
                      type: 'string',
                    },
                    isAvailable: {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Trip or seat map not found',
        },
      },
    },
  },
  '/api/bookings/create': {
    post: {
      tags: ['Bookings'],
      summary: 'Create a new booking',
      description: 'Create a new booking for a specific trip with seat selection',
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
          description: 'Booking successfully created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookingResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid data provided or seats unavailable',
        },
        404: {
          description: 'Trip or user not found',
        },
      },
    },
  },
  '/api/bookings/{bookingId}': {
    get: {
      tags: ['Bookings'],
      summary: 'Get booking details',
      description: 'Retrieve details for a specific booking by its ID',
      parameters: [
        {
          name: 'bookingId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the booking to retrieve',
        },
      ],
      responses: {
        200: {
          description: 'Booking details retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookingResponse',
              },
            },
          },
        },
        404: {
          description: 'Booking not found',
        },
      },
    },
    put: {
      tags: ['Bookings'],
      summary: 'Update an existing booking',
      description: 'Update an existing booking with new seat selections or trip details',
      parameters: [
        {
          name: 'bookingId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the booking to update',
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
        200: {
          description: 'Booking successfully updated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookingResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid data provided or seats unavailable',
        },
        404: {
          description: 'Booking or trip not found',
        },
      },
    },
  },
  '/api/bookings/{bookingId}/cancel': {
    delete: {
      tags: ['Bookings'],
      summary: 'Cancel a booking',
      description: 'Cancel a specific booking by its ID',
      parameters: [
        {
          name: 'bookingId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the booking to cancel',
        },
      ],
      responses: {
        200: {
          description: 'Booking successfully cancelled',
        },
        404: {
          description: 'Booking not found',
        },
        400: {
          description: 'Booking cannot be cancelled',
        },
      },
    },
  },
  '/api/bookings/user-bookings': {
    get: {
      tags: ['Bookings'],
      summary: 'Get bookings for a specific user',
      description: 'Retrieve a list of bookings for the currently authenticated user',
      responses: {
        200: {
          description: 'User bookings retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/BookingResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};
