const seatMapService = require('../services/seatMapService');
const { ApiResponse } = require('../utils/responses');

class SeatMapController {
  async createSeatMap(req, res, next) {
    try {
      const seatMap = await seatMapService.createSeatMap(req.body);
      res.status(201).json(new ApiResponse('Seat map created successfully', seatMap));
    } catch (error) {
      next(error);
    }
  }

  async updateSeatMap(req, res, next) {
    try {
      const seatMap = await seatMapService.updateSeatMap(req.params.seatMapId, req.body);
      res.json(new ApiResponse('Seat map updated successfully', seatMap));
    } catch (error) {
      next(error);
    }
  }

  async deleteSeatMap(req, res, next) {
    try {
      const seatMap = await seatMapService.deleteSeatMap(req.params.seatMapId);
      res.json(new ApiResponse('Seat map deleted successfully', seatMap));
    } catch (error) {
      next(error);
    }
  }

  async getSeatMap(req, res, next) {
    try {
      const seatMap = await seatMapService.getSeatMap(req.params.seatMapId);
      res.json(new ApiResponse('Seat map retrieved successfully', seatMap));
    } catch (error) {
      next(error);
    }
  }

  async getAllSeatMaps(req, res, next) {
    try {
      const { busId, page, limit, sort } = req.query;

      const filters = {
        busId,
      };

      const options = {
        page,
        limit,
        sort,
      };

      const result = await seatMapService.getAllSeatMaps(filters, options);
      res.json(new ApiResponse('Seat maps retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getSeatAvailabilityMatrix(req, res, next) {
    try {
      const { busId, date } = req.query;
      const availabilityMatrix = await seatMapService.getSeatAvailabilityMatrix(busId, date);
      res.json(new ApiResponse('Seat availability matrix retrieved successfully', availabilityMatrix));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SeatMapController();
