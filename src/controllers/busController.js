const busService = require('../services/busService');
const { ApiResponse } = require('../utils/responses');

class BusController {
  async addBus(req, res, next) {
    try {
      const bus = await busService.addBus(req.body);
      res.status(201).json(new ApiResponse('Bus added successfully', bus));
    } catch (error) {
      next(error);
    }
  }

  async getAllBuses(req, res, next) {
    try {
      const { isActive, sort, limit, skip } = req.query;

      const filters = {};
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const options = { sort, limit, skip };
      const buses = await busService.getAllBuses(filters, options);
      res.json(new ApiResponse('Buses retrieved successfully', buses));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BusController();
