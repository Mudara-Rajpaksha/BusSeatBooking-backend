module.exports = {
  schemas: {
    SeatMap: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        busId: { type: 'string' },
        layout: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              seatNumber: { type: 'string' },
              row: { type: 'integer' },
              column: { type: 'integer' },
              type: { type: 'string', enum: ['regular', 'luxury', 'disabled'] },
              isActive: { type: 'boolean' },
            },
          },
        },
        totalSeats: { type: 'integer' },
      },
    },

    CreateSeatMap: {
      type: 'object',
      required: ['busId', 'layout'],
      properties: {
        busId: { type: 'string' },
        layout: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              seatNumber: { type: 'string' },
              row: { type: 'integer' },
              column: { type: 'integer' },
              type: { type: 'string', enum: ['regular', 'luxury', 'disabled'] },
              isActive: { type: 'boolean' },
            },
          },
        },
      },
    },

    UpdateSeatMap: {
      type: 'object',
      properties: {
        layout: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              seatNumber: { type: 'string' },
              row: { type: 'integer' },
              column: { type: 'integer' },
              type: { type: 'string', enum: ['regular', 'luxury', 'disabled'] },
              isActive: { type: 'boolean' },
            },
          },
        },
      },
    },

    SeatAvailabilityMatrix: {
      type: 'object',
      properties: {
        seatNumber: {
          type: 'object',
          properties: {
            seatDetails: { type: 'object' },
            availability: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tripId: { type: 'string' },
                  departureDate: { type: 'string', format: 'date-time' },
                  available: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
  },
};
