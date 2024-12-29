const routeService = require('../services/routeService');
const { ApiResponse } = require('../utils/responses');

class RouteController {
  async createRoute(req, res, next) {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json(new ApiResponse('Route created successfully', route));
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req, res, next) {
    try {
      const route = await routeService.updateRoute(req.params.routeId, req.body);
      res.json(new ApiResponse('Route updated successfully', route));
    } catch (error) {
      next(error);
    }
  }

  async deleteRoute(req, res, next) {
    try {
      const route = await routeService.deleteRoute(req.params.routeId);
      res.json(new ApiResponse('Route deleted successfully', route));
    } catch (error) {
      next(error);
    }
  }

  async getRoute(req, res, next) {
    try {
      const route = await routeService.getRoute(req.params.routeId);
      res.json(new ApiResponse('Route retrieved successfully', route));
    } catch (error) {
      next(error);
    }
  }

  async getAllRoutes(req, res, next) {
    try {
      const { status, routeNumber, page, limit, sort } = req.query;

      const filters = {
        status,
        routeNumber,
      };

      const options = {
        page,
        limit,
        sort,
      };

      const result = await routeService.getAllRoutes(filters, options);

      res.json(new ApiResponse('Routes retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RouteController();
