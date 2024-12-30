module.exports = {
  schemas: {
    Trip: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        routeId: { type: 'string' },
        busId: { type: 'string' },
        departureDate: { type: 'string', format: 'date-time' },
        arrivalDate: { type: 'string', format: 'date-time' },
        availableSeats: { type: 'integer' },
        status: { type: 'string', enum: ['scheduled', 'cancelled'] },
        intermediateStops: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stopName: { type: 'string' },
              arrivalTime: { type: 'string', format: 'date-time' },
              departureTime: { type: 'string', format: 'date-time' },
              fareFromStart: { type: 'number' },
            },
          },
        },
        paymentRequired: { type: 'boolean' },
      },
    },
    TripAvailability: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        totalSeats: { type: 'integer' },
        bookedSeats: { type: 'integer' },
        availableSeats: { type: 'integer' },
      },
    },
    CreateTrip: {
      type: 'object',
      required: ['routeId', 'busId', 'departureDate', 'arrivalDate'],
      properties: {
        routeId: { type: 'string' },
        busId: { type: 'string' },
        departureDate: { type: 'string', format: 'date-time' },
        arrivalDate: { type: 'string', format: 'date-time' },
        paymentRequired: { type: 'boolean' },
      },
    },
    UpdateTrip: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['scheduled', 'cancelled'] },
        arrivalDate: { type: 'string', format: 'date-time' },
      },
    },
  },
};
