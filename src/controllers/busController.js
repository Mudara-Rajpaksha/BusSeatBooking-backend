const busService = require('../services/busService');
const { ApiResponse } = require('../utils/responses');

class BusController {
  async createBus(req, res, next) {
    try {
      const bus = await busService.createBus(req.body);
      res.status(201).json(new ApiResponse('Bus created successfully', bus));
    } catch (error) {
      next(error);
    }
  }

  async updateBus(req, res, next) {
    try {
      const bus = await busService.updateBus(req.params.busId, req.body);
      res.json(new ApiResponse('Bus updated successfully', bus));
    } catch (error) {
      next(error);
    }
  }

  async deleteBus(req, res, next) {
    try {
      const bus = await busService.deleteBus(req.params.busId);
      res.json(new ApiResponse('Bus deleted successfully', bus));
    } catch (error) {
      next(error);
    }
  }

  async getBus(req, res, next) {
    try {
      const bus = await busService.getBus(req.params.busId);
      res.json(new ApiResponse('Bus retrieved successfully', bus));
    } catch (error) {
      next(error);
    }
  }

  async getAllBuses(req, res, next) {
    try {
      const { status, manufacturer, page, limit, sort } = req.query;

      const filters = {
        status,
        manufacturer,
      };

      const options = {
        page,
        limit,
        sort,
      };

      const result = await busService.getAllBuses(filters, options);

      res.json(new ApiResponse('Buses retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BusController();
