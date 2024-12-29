const mongoose = require('mongoose');

const permitSchema = new mongoose.Schema(
  {
    permitNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    holderName: {
      type: String,
      required: true,
      index: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['bus', 'minibus', 'luxury'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'suspended', 'cancelled'],
      default: 'active',
      index: true,
    },
    issuedDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    documents: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

permitSchema.index({ permitNumber: 1, status: 1 });
module.exports = mongoose.model('Permit', permitSchema);
