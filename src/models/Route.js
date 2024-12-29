const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    stops: [
      {
        name: {
          type: String,
          required: true,
        },
        distance: {
          type: Number,
          required: true,
        },
        timeFromStart: {
          type: String,
          required: true,
        },
      },
    ],
    fare: {
      type: Number,
      required: true,
    },
    schedules: [
      {
        departureTime: String,
        arrivalTime: String,
        frequency: Number,
        daysOperating: [String],
      },
    ],
    buses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

routeSchema.index({ routeNumber: 1, status: 1 });
module.exports = mongoose.model('Route', routeSchema);
