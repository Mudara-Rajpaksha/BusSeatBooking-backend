const Trip = require('../models/Trip');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const { ApiError } = require('../utils/responses');

class TripService {
  async createTrip(tripData, createdBy) {
    const { route: routeId, bus: busId } = tripData;

    const route = await Route.findOne({ _id: routeId, isActive: true });
    if (!route) {
      throw new ApiError('Route not found or inactive', 404);
    }

    const bus = await Bus.findOne({ _id: busId, isActive: true });
    if (!bus) {
      throw new ApiError('Bus not found or inactive', 404);
    }

    const trip = new Trip({
      ...tripData,
      availableSeats: bus.seats.length,
      createdBy,
    });

    await trip.save();

    return trip.populate([
      { path: 'route', select: 'origin destination price' },
      { path: 'bus', select: 'registrationNumber seats' },
    ]);
  }

  async getAllTrips(filters = {}, options = {}) {
    const query = Trip.find(filters)
      .populate('route', 'origin destination price schedule')
      .populate({
        path: 'bus',
        select: 'registrationNumber seats',
        populate: {
          path: 'seats',
          match: { isBooked: false },
        },
      });

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.select) {
      query.select(options.select);
    }

    if (options.limit) {
      query.limit(parseInt(options.limit));
    }

    if (options.skip) {
      query.skip(parseInt(options.skip));
    }

    return await query.exec();
  }
}

module.exports = new TripService();
