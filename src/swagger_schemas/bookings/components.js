module.exports = {
  schemas: {
    TripInput: {
      type: 'object',
      required: ['departureDate', 'routeId', 'busId', 'status'],
      properties: {
        departureDate: {
          type: 'string',
          format: 'date-time',
          description: 'The departure date and time of the trip',
        },
        routeId: {
          type: 'string',
          description: 'The route ID for the trip',
        },
        busId: {
          type: 'string',
          description: 'The bus ID for the trip',
        },
        status: {
          type: 'string',
          enum: ['scheduled', 'completed', 'cancelled'],
          description: 'The status of the trip',
        },
        availableSeats: {
          type: 'integer',
          description: 'The number of available seats for the trip',
        },
      },
    },
    BookingInput: {
      type: 'object',
      required: ['tripId', 'userId', 'seatIds', 'fromStop', 'toStop'],
      properties: {
        tripId: {
          type: 'string',
          description: 'The ID of the trip being booked',
        },
        userId: {
          type: 'string',
          description: 'The ID of the user making the booking',
        },
        seatIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The IDs of the selected seats',
        },
        fromStop: {
          type: 'string',
          description: 'The starting stop for the trip',
        },
        toStop: {
          type: 'string',
          description: 'The ending stop for the trip',
        },
        paymentDetails: {
          type: 'object',
          description: 'Payment details for the booking (if required)',
          properties: {
            paymentMethod: {
              type: 'string',
              description: 'The payment method used for booking',
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'The total amount paid for the booking',
            },
          },
        },
      },
    },
    BookingResponse: {
      type: 'object',
      properties: {
        bookingId: {
          type: 'string',
          description: 'The unique ID of the booking',
        },
        tripId: {
          type: 'string',
          description: 'The ID of the trip for this booking',
        },
        seatIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The IDs of the booked seats',
        },
        status: {
          type: 'string',
          enum: ['confirmed', 'pending', 'cancelled'],
          description: 'The current status of the booking',
        },
        totalFare: {
          type: 'number',
          format: 'float',
          description: 'The total fare for the booking',
        },
      },
    },
  },
  responses: {
    BookingNotFound: {
      description: 'The booking could not be found',
    },
    TripNotFound: {
      description: 'The trip could not be found',
    },
    SeatUnavailable: {
      description: 'The selected seats are no longer available',
    },
    InvalidSeatIds: {
      description: 'One or more seat IDs are invalid',
    },
  },
};
