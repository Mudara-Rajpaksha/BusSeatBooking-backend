const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
      index: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    layout: [
      {
        seatNumber: {
          type: String,
          required: true,
        },
        row: {
          type: Number,
          required: true,
        },
        column: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ['regular', 'luxury', 'disabled'],
          default: 'regular',
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const tripSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
      index: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
      index: true,
    },
    departureDate: {
      type: Date,
      required: true,
      index: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    paymentRequired: {
      type: Boolean,
      default: false,
    },
    intermediateStops: [
      {
        stopName: {
          type: String,
          required: true,
        },
        arrivalTime: {
          type: Date,
          required: true,
        },
        departureTime: {
          type: Date,
          required: true,
        },
        fareFromStart: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const bookingSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'SeatMap.layout',
      },
    ],
    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    fromStop: {
      type: String,
      required: true,
    },
    toStop: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'expired'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['not_required', 'pending', 'partial', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      amountPaid: {
        type: Number,
        default: 0,
      },
      paymentMethod: String,
      transactionId: String,
      paymentDate: Date,
      remainingAmount: Number,
    },
    expiryDate: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

seatMapSchema.index({ busId: 1 });
tripSchema.index({ routeId: 1, departureDate: 1 });
tripSchema.index({ busId: 1, departureDate: 1 });
bookingSchema.index({ tripId: 1, status: 1 });
bookingSchema.index({ userId: 1, status: 1 });

module.exports = {
  SeatMap: mongoose.model('SeatMap', seatMapSchema),
  Trip: mongoose.model('Trip', tripSchema),
  Booking: mongoose.model('Booking', bookingSchema),
};
