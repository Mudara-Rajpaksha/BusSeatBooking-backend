const mongoose = require('mongoose');
const busSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    permit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permit',
      required: true,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 10,
      max: 80,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    yearOfManufacture: {
      type: Number,
      required: true,
    },
    maintenanceHistory: [
      {
        date: Date,
        description: String,
        cost: Number,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'maintenance', 'retired'],
      default: 'active',
    },
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
  },
  {
    timestamps: true,
  }
);

busSchema.index({ registrationNumber: 1, status: 1 });
module.exports = mongoose.model('Bus', busSchema);
