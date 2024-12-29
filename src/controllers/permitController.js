const permitService = require('../services/permitService');
const { ApiResponse } = require('../utils/responses');

class PermitController {
  async createPermit(req, res, next) {
    try {
      const permit = await permitService.createPermit(req.body);
      res.status(201).json(new ApiResponse('Permit created successfully', permit));
    } catch (error) {
      next(error);
    }
  }

  async updatePermit(req, res, next) {
    try {
      const permit = await permitService.updatePermit(req.params.permitId, req.body);
      res.json(new ApiResponse('Permit updated successfully', permit));
    } catch (error) {
      next(error);
    }
  }

  async deletePermit(req, res, next) {
    try {
      const permit = await permitService.deletePermit(req.params.permitId);
      res.json(new ApiResponse('Permit deleted successfully', permit));
    } catch (error) {
      next(error);
    }
  }

  async getPermit(req, res, next) {
    try {
      const permit = await permitService.getPermit(req.params.permitId);
      res.json(new ApiResponse('Permit retrieved successfully', permit));
    } catch (error) {
      next(error);
    }
  }

  async getAllPermits(req, res, next) {
    try {
      const { status, vehicleType, page, limit, sort } = req.query;

      const filters = {
        status,
        vehicleType,
      };

      const options = {
        page,
        limit,
        sort,
      };

      const result = await permitService.getAllPermits(filters, options);

      res.json(new ApiResponse('Permits retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermitController();
