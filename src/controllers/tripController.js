const tripService = require('../services/tripService');
const { ApiResponse } = require('../utils/responses');

class TripController {
  async createTrip(req, res, next) {
    try {
      const trip = await tripService.createTrip(req.body, req.user._id);
      res.status(201).json(new ApiResponse('Trip created successfully', trip));
    } catch (error) {
      next(error);
    }
  }

  async getAllTrips(req, res, next) {
    try {
      const { route, bus, status, sort, limit, skip } = req.query;

      const filters = {};
      if (route) filters.route = route;
      if (bus) filters.bus = bus;
      if (status) filters.status = status;

      const options = { sort, limit, skip };
      const trips = await tripService.getAllTrips(filters, options);
      res.json(new ApiResponse('Trips retrieved successfully', trips));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripController();
