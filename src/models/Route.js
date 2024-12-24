const mongoose = require('mongoose');

const isValidTimeFormat = (time) => {
  const timeRegex = /^(0?[1-9]|1[0-2]):00 (AM|PM)$/;
  return timeRegex.test(time);
};

const routeSchema = new mongoose.Schema(
  {
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    schedule: {
      type: [String],
      required: true,
      validate: {
        validator: function (schedules) {
          if (!Array.isArray(schedules) || schedules.length === 0) {
            return false;
          }
          return schedules.every((time) => isValidTimeFormat(time));
        },
        message: 'Invalid schedule time format. Must be in HH:00 AM/PM format',
      },
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: async function (operatorId) {
          const user = await mongoose.model('User').findById(operatorId);
          return user && user.role === 'operator';
        },
        message: 'Invalid operator ID or user is not an operator',
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Route', routeSchema);
