module.exports = {
  schemas: {
    BusInput: {
      type: 'object',
      required: ['registrationNumber', 'seats'],
      properties: {
        registrationNumber: {
          type: 'string',
          description: 'The registration number of the bus',
        },
        seats: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              seatNumber: {
                type: 'string',
                description: 'The seat number in the bus',
              },
              isBooked: {
                type: 'boolean',
                description: 'Whether the seat is booked or not',
              },
            },
          },
          description: 'The seats in the bus',
        },
        amenities: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Amenities available on the bus',
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the bus is active or not',
        },
      },
    },
    BusResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Success message for the operation',
        },
        bus: {
          type: 'object',
          description: 'The bus object created or retrieved',
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
    InvalidData: {
      description: 'Invalid data provided for the bus',
    },
  },
};
