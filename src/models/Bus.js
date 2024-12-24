const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const busSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    seats: {
      type: [seatSchema],
      default: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }, { seatNumber: 'B1' }, { seatNumber: 'B2' }],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bus', busSchema);
