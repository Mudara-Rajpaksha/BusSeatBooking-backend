const tripService = require('../services/tripService');
const { ApiResponse } = require('../utils/responses');

class TripController {
  async createTrip(req, res, next) {
    try {
      const trip = await tripService.createTrip(req.body);
      res.status(201).json(new ApiResponse('Trip created successfully', trip));
    } catch (error) {
      next(error);
    }
  }

  async updateTrip(req, res, next) {
    try {
      const trip = await tripService.updateTrip(req.params.tripId, req.body);
      res.json(new ApiResponse('Trip updated successfully', trip));
    } catch (error) {
      next(error);
    }
  }

  async deleteTrip(req, res, next) {
    try {
      const trip = await tripService.deleteTrip(req.params.tripId);
      res.json(new ApiResponse('Trip deleted successfully', trip));
    } catch (error) {
      next(error);
    }
  }

  async getTrip(req, res, next) {
    try {
      const trip = await tripService.getTrip(req.params.tripId);
      res.json(new ApiResponse('Trip retrieved successfully', trip));
    } catch (error) {
      next(error);
    }
  }

  async getAllTrips(req, res, next) {
    try {
      const { status, routeId, busId, dateRange, page, limit, sort } = req.query;

      const filters = {
        status,
        routeId,
        busId,
        dateRange: dateRange ? JSON.parse(dateRange) : undefined,
      };

      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort,
      };

      const result = await tripService.getAllTrips(filters, options);

      res.json(new ApiResponse('Trips retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async checkTripAvailability(req, res, next) {
    try {
      const { tripId } = req.params;
      const { fromStop, toStop, seatCount } = req.query;

      const availability = await tripService.checkTripAvailability(tripId, fromStop, toStop, parseInt(seatCount, 10));

      res.json(new ApiResponse('Trip availability checked successfully', availability));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripController();
