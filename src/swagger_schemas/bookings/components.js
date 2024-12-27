module.exports = {
  schemas: {
    BookingInput: {
      type: 'object',
      required: ['trip', 'seat'],
      properties: {
        trip: {
          type: 'string',
          format: 'uuid',
          description: 'Trip ID associated with the booking',
        },
        seat: {
          type: 'string',
          description: 'Seat number to be booked',
        },
        price: {
          type: 'number',
          description: 'Total price for the booking',
        },
      },
    },
    Booking: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Unique identifier for the booking',
        },
        user: {
          type: 'string',
          format: 'uuid',
          description: 'User ID associated with the booking',
        },
        trip: {
          type: 'string',
          format: 'uuid',
          description: 'Trip ID associated with the booking',
        },
        seat: {
          type: 'string',
          description: 'Booked seat number',
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
          description: 'Status of the booking',
        },
        price: {
          type: 'number',
          description: 'Total price for the booking',
        },
        bookedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Booking creation timestamp',
        },
      },
    },
  },
  responses: {
    UnauthorizedError: {
      description: 'Access token is missing or invalid',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'error',
              },
              message: {
                type: 'string',
                example: 'Unauthorized access',
              },
            },
          },
        },
      },
    },
    BookingNotFound: {
      description: 'Booking not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'error',
              },
              message: {
                type: 'string',
                example: 'Booking not found',
              },
            },
          },
        },
      },
    },
    BookingCancelled: {
      description: 'Booking has been successfully cancelled',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'success',
              },
              message: {
                type: 'string',
                example: 'Booking cancelled successfully',
              },
            },
          },
        },
      },
    },
  },
};
